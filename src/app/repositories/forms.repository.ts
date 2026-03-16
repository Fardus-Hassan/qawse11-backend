import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';
import { FormType, FormPayload } from '../types/forms';

export const findSubmissionByUserAndType = async (userId: string, type: FormType) => {
  return prisma.formSubmission.findFirst({ where: { userId, type } });
};

export const createFormSubmission = async (
  userId: string,
  type: FormType,
  data: FormPayload,
  ip?: string
) => {
  return prisma.formSubmission.create({
    data: {
      userId,
      type,
      data: data as unknown as Prisma.InputJsonValue,
      ip,
    },
  });
};

export const incrementUserSubmissionCount = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { formSubmissionCount: { increment: 1 } },
  });
};

export const findFormStatsByType = async (formType: FormType) => {
  return prisma.formStats.findUnique({ where: { formType } });
};

export const createFormStats = async (
  formType: FormType,
  totalSubmissions = 0,
  uniqueUsers = 0
) => {
  return prisma.formStats.create({ data: { formType, totalSubmissions, uniqueUsers } });
};

export const updateFormStats = async (formType: FormType, data: Prisma.FormStatsUpdateInput) => {
  return prisma.formStats.update({ where: { formType }, data });
};

export const findFormSubmissions = async (
  where: Prisma.FormSubmissionWhereInput,
  skip = 0,
  take = 10
) => {
  return prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });
};

export const countFormSubmissions = async (where: Prisma.FormSubmissionWhereInput) => {
  return prisma.formSubmission.count({ where });
};

export const findFormsByUser = async (where: Prisma.FormSubmissionWhereInput) => {
  return prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, type: true, data: true, createdAt: true },
  });
};

export const findAllFormStats = async () => {
  return prisma.formStats.findMany();
};
