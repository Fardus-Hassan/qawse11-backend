import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }).min(6, {
      message: 'Current password must be at least 6 characters long',
    }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, { message: 'New password must be at least 6 characters long' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z
    .object({
      newPassword: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match!',
      path: ['confirmPassword'],
    }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

const resendConfirmationLinkValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
  }),
});

const customerSupportValidationSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: "First name is required" }).min(1, "First name cannot be empty"),
    lastName: z.string({ required_error: "Last name is required" }).min(1, "Last name cannot be empty"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    company: z.string().optional(),
    country: z.string({ required_error: "Country is required" }).min(1, "Country cannot be empty"),
    projectType: z.string({ required_error: "Project type is required" }).min(1, "Project type cannot be empty"),
    budgetRange: z.string({ required_error: "Budget range is required" }).min(1, "Budget range cannot be empty"),
    message: z.string({ required_error: "Message is required" }).min(10, "Message must be at least 10 characters"),
  }),
});
export const AuthValidation = {
  loginValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resendConfirmationLinkValidationSchema,
  sendOtpSchema,
  verifyOtpSchema,
  customerSupportValidationSchema
};
