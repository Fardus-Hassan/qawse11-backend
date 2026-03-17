import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5005),
  HOST: z.string().default('localhost'),
  DATABASE_URL: z.string().optional(),

  EMAIL_FROM: z.string().optional(),
  BREVO_EMAIL: z.string().optional(),
  BREVO_PASS: z.string().optional(),
  FORM_SUBMISSION_EMAIL: z.string().email().optional(),

  JWT_ACCESS_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().optional(),
  JWT_RESET_PASS_ACCESS_EXPIRES_IN: z.string().optional(),

  OTP_EXPIRES_IN_MINUTES: z.coerce.number().default(10),
  OTP_RATE_LIMIT_COUNT: z.coerce.number().default(3),
  OTP_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(60),
  OTP_MAX_VERIFY_ATTEMPTS: z.coerce.number().default(5),

  SUPER_ADMIN_EMAIL: z.string().optional(),
  SUPER_ADMIN_PASSWORD: z.string().optional(),

  IMAGE_URL: z.string().optional(),
  BACKEND_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  RESET_PASS_UI_LINK: z.string().optional(),
  VERIFY_RESET_PASS_LINK: z.string().optional(),
  VERIFY_EMAIL_LINK: z.string().optional(),
});

const parsed = envSchema.parse(process.env);

const config = {
  NODE_ENV: parsed.NODE_ENV,
  port: parsed.PORT,
  host: parsed.HOST,
  databaseUrl: parsed.DATABASE_URL,
  sendEmail: {
    email_from: parsed.EMAIL_FROM,
    brevo_pass: parsed.BREVO_PASS,
    brevo_email: parsed.BREVO_EMAIL,
    form_submission_email: parsed.FORM_SUBMISSION_EMAIL,
  },
  superAdmin: {
    email: parsed.SUPER_ADMIN_EMAIL,
    password: parsed.SUPER_ADMIN_PASSWORD,
  },
  url: {
    image: parsed.IMAGE_URL,
    backend: parsed.BACKEND_URL,
    frontend: parsed.FRONTEND_URL,
  },
  verify: {
    email: parsed.VERIFY_EMAIL_LINK,
    resetPassUI: parsed.RESET_PASS_UI_LINK,
    resetPassLink: parsed.VERIFY_RESET_PASS_LINK,
  },
  smtp: {
    email: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
    email_from: process.env.SMTP_EMAIL_FROM,
    host: process.env.SMTP_HOST,
    name: process.env.SMTP_NAME,
    port: process.env.SMTP_PORT
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_token_secret: process.env.JWT_REFRESH_SECRET,
    refresh_token_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};

export type AppConfig = typeof config;
export default config;
