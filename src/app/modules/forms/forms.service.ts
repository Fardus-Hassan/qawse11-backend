import { mailService } from '../../mail/mail.service';
import prisma from '../../utils/prisma';

const createForm = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  websiteUrl?: string;
  industry: string;
  monthlyMarketingBudget: string;
  primaryGoal: string;
  currentMarketingChannels: string[];
  additionalDetails?: string;
  ip?: string;
}) => {
  const form = await prisma.form.create({
    data: payload,
  });

  await mailService.sendConsultationEmail(payload);

  return form;
};

export const FormService = {
  createForm,
};
