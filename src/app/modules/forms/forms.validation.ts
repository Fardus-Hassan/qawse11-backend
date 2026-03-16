import { z } from 'zod';

export const getInTouchSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    message: z.string().min(1, { message: 'Message is required' }),
  }),
});

export const contactSchema = z.object({
  body: z.object({
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    company_name: z.string().optional(),
    country: z.string().min(1, { message: 'Country is required' }),
    project_type: z.string().min(1, { message: 'Project type is required' }),
    budget_range: z.string().min(1, { message: 'Budget range is required' }),
    message: z.string().min(1, { message: 'Message is required' }),
  }),
});

export const consultationSchema = z.object({
  body: z.object({
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    company_name: z.string().optional(),
    timeline: z.string().min(1, { message: 'Timeline is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    project_type: z.string().min(1, { message: 'Project type is required' }),
    budget_range: z.string().min(1, { message: 'Budget range is required' }),
    helps: z.array(z.string()).optional(),
    project_details: z.string().min(1, { message: 'Project details are required' }),
  }),
});

export const getFormsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined)),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined)),
    filter: z.enum(['getInTouch', 'contact', 'consultation']).optional(),
  }),
});

export const getFormsByUserSchema = z.object({
  params: z.object({
    userId: z.union([
      z.string().uuid({ message: 'Invalid user id' }),
      z.string().regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid user id' }),
    ]),
  }),
  query: z.object({
    filter: z.enum(['getInTouch', 'contact', 'consultation']).optional(),
  }),
});
