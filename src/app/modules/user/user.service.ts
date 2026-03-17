import status from 'http-status';
import ApiError from '../../errors/AppError';
import { User } from '@prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';
import { hashPassword } from '../../helpers/hashPassword';
import { CreateUserDTO, UpdateUserDTO } from '../../types/user';
import * as UsersRepo from '../../repositories/users.repository';
import prisma from '../../utils/prisma';
import { sendOTP } from '../../utils/sendOTP';

const createUserIntoDB = async (payload: CreateUserDTO) => {
  // Check if user exists by email
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new ApiError(status.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    isVerified: false,
  };

  const user = await prisma.user.create({
    data: userData
  })
  await sendOTP(user.id);

};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UsersRepo.userModel, query)
    .search(['fullName', 'email'])
    .select(['id', 'email', 'fullName', 'profilePic', 'role'])
    .paginate();

  const { result, meta } = await UsersRepo.queryUsers(userQuery);

  if (!result.length) {
    throw new ApiError(status.NOT_FOUND, 'No users found!');
  }

  // Remove password from each user
  const data = result.map((user: User) => {
    const { password, ...rest } = user;
    return rest;
  });

  return {
    meta,
    data,
  };
};

const updateUserIntoDB = async (userId: string, payload: UpdateUserDTO) => {
  const isUserExist = await UsersRepo.findUserById(userId);

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  if (!payload.profilePic && isUserExist.profileImage) {
    payload.profilePic = isUserExist.profileImage;
  }

  const updatedUser = await UsersRepo.updateUser(userId, {
    fullName: payload.fullName,
    profilePic: payload.profilePic || '',
  } as any);

  return updatedUser;
};

const getSingleUserByIdFromDB = async (userId: string) => {
  const user = await UsersRepo.findUserById(userId);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  const { password, ...rest } = user as any;

  return rest;
};

const deleteUserFromDB = async (userId: string) => {
  const isUserExist = await UsersRepo.findUserById(userId);

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  await UsersRepo.deleteUser(userId);

  return null;
};

export const UserService = {
  createUserIntoDB,
  getAllUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getSingleUserByIdFromDB,
};
