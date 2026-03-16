import {
  GetInTouchDTO,
  ContactDTO,
  ConsultationDTO,
  FormPayload,
  FormFilter,
  FormType,
} from '../../types/forms';
import * as FormsRepo from '../../repositories/forms.repository';
import { sendFormSubmissionEmail } from '../../utils/sendEmail';
import * as UsersRepo from '../../repositories/users.repository';
import logger from '../../utils/logger';

const submitForm = async (userId: string, type: FormType, data: FormPayload, ip?: string) => {
  // check if user already submitted this type before (for uniqueUsers)
  const hasSubmittedBefore = await FormsRepo.findSubmissionByUserAndType(userId, type as FormType);

  // create submission
  const submission = await FormsRepo.createFormSubmission(userId, type as FormType, data, ip);

  // increment user submission count
  await FormsRepo.incrementUserSubmissionCount(userId);

  // update form stats
  const existing = await FormsRepo.findFormStatsByType(type as FormType);
  if (existing) {
    // increment total
    await FormsRepo.updateFormStats(type as FormType, { totalSubmissions: { increment: 1 } });
    // increment uniqueUsers if this user hasn't submitted this type before
    if (!hasSubmittedBefore) {
      await FormsRepo.updateFormStats(type as FormType, { uniqueUsers: { increment: 1 } });
    }
  } else {
    await FormsRepo.createFormStats(type as FormType, 1, hasSubmittedBefore ? 0 : 1);
  }

  // Send email notification with form data
  try {
    const user = await UsersRepo.findUserById(userId);
    await sendFormSubmissionEmail(
      type as FormType,
      data,
      user?.email,
      user?.fullName || undefined
    );
  } catch (error) {
    // Log error but don't fail the submission
    logger.error('Failed to send form submission email', { error, userId, formType: type });
  }

  return submission;
};

const submitGetInTouch = async (userId: string, payload: GetInTouchDTO, ip?: string) => {
  return submitForm(userId, 'GET_IN_TOUCH', payload, ip);
};

const submitContact = async (userId: string, payload: ContactDTO, ip?: string) => {
  return submitForm(userId, 'CONTACT', payload, ip);
};

const submitConsultation = async (userId: string, payload: ConsultationDTO, ip?: string) => {
  return submitForm(userId, 'CONSULTATION', payload, ip);
};

const getForms = async (page = 1, limit = 10, filter?: FormFilter) => {
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filter) {
    const map: Record<FormFilter, FormType> = {
      getInTouch: 'GET_IN_TOUCH',
      contact: 'CONTACT',
      consultation: 'CONSULTATION',
    };
    (where as any).type = map[filter as FormFilter];
  }

  const [data, total] = await Promise.all([
    FormsRepo.findFormSubmissions(where as any, skip, limit),
    FormsRepo.countFormSubmissions(where as any),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getFormsByUser = async (userId: string, filter?: FormFilter) => {
  const where: Record<string, unknown> = { userId };
  if (filter) {
    const map: Record<FormFilter, FormType> = {
      getInTouch: 'GET_IN_TOUCH',
      contact: 'CONTACT',
      consultation: 'CONSULTATION',
    };
    (where as any).type = map[filter as FormFilter];
  }

  const data = await FormsRepo.findFormsByUser(where as any);

  return data;
};

export const formatFormStats = (rows: any[]) => {
  const resultMap: Record<string, { totalSubmissions: number; uniqueUsers: number }> = {
    GET_IN_TOUCH: { totalSubmissions: 0, uniqueUsers: 0 },
    CONTACT: { totalSubmissions: 0, uniqueUsers: 0 },
    CONSULTATION: { totalSubmissions: 0, uniqueUsers: 0 },
  };

  for (const r of rows) {
    resultMap[r.formType] = {
      totalSubmissions: r.totalSubmissions,
      uniqueUsers: r.uniqueUsers,
    };
  }

  // Return as array for easy consumption
  return Object.keys(resultMap).map((formType) => ({
    formType,
    totalSubmissions: resultMap[formType].totalSubmissions,
    uniqueUsers: resultMap[formType].uniqueUsers,
  }));
};

const getFormStats = async () => {
  const rows = await FormsRepo.findAllFormStats();
  return formatFormStats(rows);
};

export const FormsService = {
  submitGetInTouch,
  submitContact,
  submitConsultation,
  getForms,
  getFormsByUser,
  getFormStats,
  formatFormStats,
};
