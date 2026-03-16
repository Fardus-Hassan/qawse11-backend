import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const updateUserByEmail = async (email: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { email }, data });
};

export const getUserForRefresh = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePic: true,
      isVerified: true,
      passwordChangedAt: true,
    },
  });
};

export const updatePasswordByEmail = async (email: string, hashedPassword: string) => {
  return prisma.user.update({
    where: { email },
    data: { password: hashedPassword, passwordChangedAt: new Date() },
  });
};

export const getMeSelect = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePic: true,
      role: true,
      isVerified: true,
    },
  });
};
