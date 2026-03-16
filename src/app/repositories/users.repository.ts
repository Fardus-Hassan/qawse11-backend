import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const userModel = prisma.user;

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};

// export const deleteUser = async (id: string) => {
//   return prisma.user.delete({ where: { id } });
// };

export const deleteUser = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    await tx.formSubmission.deleteMany({
      where: { userId: id },
    });

    return tx.user.delete({
      where: { id },
    });
  });
};

export const queryUsers = async (queryBuilder: any) => {
  const [result, meta] = await Promise.all([queryBuilder.execute(), queryBuilder.countTotal()]);
  return { result, meta };
};
