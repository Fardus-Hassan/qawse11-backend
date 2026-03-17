import { z } from 'zod';

const createFormSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }).min(1, 'First name cannot be empty'),
    lastName: z.string({ required_error: 'Last name is required' }).min(1, 'Last name cannot be empty'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    phoneNumber: z.string({ required_error: 'Phone number is required' }).min(5, 'Phone number is too short'),
    companyName: z.string({ required_error: 'Company name is required' }).min(1, 'Company name cannot be empty'),
    websiteUrl: z.string().url('Invalid URL').optional(),
    industry: z.string({ required_error: 'Industry is required' }).min(1, 'Industry cannot be empty'),
    monthlyMarketingBudget: z.string({ required_error: 'Monthly marketing budget is required' }).min(1, 'Budget cannot be empty'),
    primaryGoal: z.string({ required_error: 'Primary goal is required' }).min(1, 'Primary goal cannot be empty'),
    currentMarketingChannels: z
      .array(z.string())
      .min(1, 'At least one marketing channel is required'),
    additionalDetails: z.string().optional(),
  }),
});

export const FormValidation = {
  createFormSchema,
};
