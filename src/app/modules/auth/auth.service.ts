import status from 'http-status';
import config from '../../config';
import ApiError from '../../errors/AppError';
import { jwtHelpers } from './../../helpers/jwtHelpers';
import { passwordCompare } from '../../helpers/comparePasswords';
import { hashPassword } from '../../helpers/hashPassword';
import * as AuthRepo from '../../repositories/auth.repository';
import { UserRole } from '@prisma/client';
import prisma from '../../utils/prisma';
import { sendOTP } from '../../utils/sendOTP';
import { comparePassword, createToken } from './auth.utils';
import { mailService } from '../../mail/mail.service';

const loginUser = async (email: string, password: string) => {
  const user = await AuthRepo.findUserByEmail(email);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  const isPasswordMatched = await passwordCompare(password, user.password as string);

  if (!isPasswordMatched) {
    throw new ApiError(status.UNAUTHORIZED, 'Password is incorrect!');
  }

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName as string,
    email: user.email as string,
    profileImage: user.profileImage,
    role: user.role as UserRole,
    isVerified: user.isVerified as boolean,
  };

  // If user is not verified, send OTP for verification instead of link
  if (!user.isVerified) {
    await sendOTP(user.id);

    throw new ApiError(
      status.UNAUTHORIZED,
      'User is not verified! We have sent an OTP to your email address. Please verify your account.'
    );
  }

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
const resendOTP = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  await sendOTP(user.id)
  return {
    message: "New OTP has been sent to your email!.",
  };
};



const verifyOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }
  const savedOtp = await prisma.oTP.findUnique({ where: { userId: user.id } })

  if (!savedOtp) {
    throw new ApiError(status.BAD_REQUEST, "OTP Not found!");
  }

  if (savedOtp.otpExpiresAt! < new Date()) {
    throw new ApiError(status.BAD_REQUEST, "OTP has expired!");
  }

  if (Number(savedOtp.otpCode) !== Number(otp)) {
    throw new ApiError(status.BAD_REQUEST, "OTP not matched!");
  }

  // update database
  await prisma.oTP.delete({
    where: { id: savedOtp.id },
  });

  // Mark user as verified
  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName ?? undefined,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );
  return {
    accessToken,
    refreshToken
  }
};

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const isPasswordMatch = await comparePassword(currentPassword, user.password ?? "");

  if (!isPasswordMatch) {
    throw new ApiError(status.UNAUTHORIZED, "Current password is incorrect!");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword
    },
  });

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  // Step 1: Generate OTP
  await sendOTP(user.id);
  return {
    message: "OTP has been sent to your email!"
  }
};

const resetPassword = async (
  id: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, "Passwords do not match!");
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password reset successfully!",
  };
};
const sendCustomerSupportEmail = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  country: string;
  projectType: string;
  budgetRange: string;
  message: string;
}) => {
  await mailService.sendCustomerSupportEmail(payload);

  return {
    message: "Your support request has been submitted successfully!",
  };
};
export const AuthService = {
  loginUser,
  resendOTP,
  verifyOtp,
  resetPassword,
  changePassword,
  forgotPassword,
  sendCustomerSupportEmail
};
