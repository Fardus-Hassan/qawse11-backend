import status from 'http-status';
import config from '../../config';
import ApiError from '../../errors/AppError';
import { RefreshPayload } from './auth.interface';
import { sendOtpEmail } from '../../utils/sendEmail';
import { jwtHelpers } from './../../helpers/jwtHelpers';
import { passwordCompare } from '../../helpers/comparePasswords';
import { hashPassword } from '../../helpers/hashPassword';
import { generateNumericOtp, hashOtp, compareOtp, isOtpExpired } from '../../helpers/otpHelpers';
import * as AuthRepo from '../../repositories/auth.repository';
import { Prisma, UserRole } from '@prisma/client';

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
    profilePic: user.profilePic,
    role: user.role as UserRole,
    isVerified: user.isVerified as boolean,
  };

  // If user is not verified, send OTP for verification instead of link
  if (!user.isVerified) {
    await sendOtp(email, 'VERIFY');

    throw new ApiError(
      status.UNAUTHORIZED,
      'User is not verified! We have sent an OTP to your email address. Please verify your account.'
    );
  }

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const sendOtp = async (email: string, purpose: 'VERIFY' | 'RESET' = 'VERIFY') => {
  const cfg = config;

  const user = await AuthRepo.findUserByEmail(email);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  // Rate limit per user
  const now = new Date();
  if (user.otpRequestReset && user.otpRequestReset.getTime() > now.getTime()) {
    if ((user.otpRequestCount || 0) >= cfg.jwt.otp.rateLimitCount) {
      throw new ApiError(status.TOO_MANY_REQUESTS, 'OTP request limit reached. Please try later.');
    }
  } else {
    // reset window
    await AuthRepo.updateUserByEmail(email, {
      otpRequestCount: 0,
      otpRequestReset: new Date(now.getTime() + cfg.jwt.otp.rateLimitWindowMinutes * 60000),
    } as Prisma.UserUpdateInput);
  }

  // Generate OTP
  const otp = generateNumericOtp(6);
  const hashed = await hashOtp(otp);

  const expiry = new Date(now.getTime() + cfg.jwt.otp.expiresInMinutes * 60000);

  await AuthRepo.updateUserByEmail(email, {
    otpCode: hashed,
    otpExpiry: expiry,
    otpAttempts: 0,
    otpPurpose: purpose,
    otpRequestCount: { increment: 1 },
    otpRequestReset:
      user.otpRequestReset && user.otpRequestReset.getTime() > now.getTime()
        ? user.otpRequestReset
        : new Date(now.getTime() + cfg.jwt.otp.rateLimitWindowMinutes * 60000),
  } as Prisma.UserUpdateInput);

  // send email
  await sendOtpEmail(email, otp, cfg.jwt.otp.expiresInMinutes, purpose);

  return { message: 'OTP sent successfully.' };
};

const resendOtp = async (email: string, purpose: 'VERIFY' | 'RESET' = 'VERIFY') => {
  return sendOtp(email, purpose);
};

const verifyOtp = async (email: string, otp: string, purpose: 'VERIFY' | 'RESET' = 'VERIFY') => {
  const user = await AuthRepo.findUserByEmail(email);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  if (!user.otpCode || !user.otpExpiry) {
    throw new ApiError(status.BAD_REQUEST, 'No OTP found for this user. Please request a new OTP.');
  }

  if (user.otpPurpose && user.otpPurpose !== purpose) {
    throw new ApiError(status.BAD_REQUEST, 'OTP purpose mismatch. Please request a new OTP.');
  }

  if (isOtpExpired(user.otpExpiry)) {
    // clear otp
    await AuthRepo.updateUserByEmail(email, {
      otpCode: null,
      otpExpiry: null,
      otpAttempts: 0,
      otpPurpose: null,
    } as Prisma.UserUpdateInput);
    throw new ApiError(status.BAD_REQUEST, 'OTP expired');
  }

  const cfg = config;

  if ((user.otpAttempts || 0) >= cfg.jwt.otp.maxVerifyAttempts) {
    throw new ApiError(status.TOO_MANY_REQUESTS, 'Too many attempts');
  }

  const isMatch = await compareOtp(otp, user.otpCode as string);

  if (!isMatch) {
    await AuthRepo.updateUserByEmail(email, {
      otpAttempts: { increment: 1 },
    } as Prisma.UserUpdateInput);
    throw new ApiError(status.UNAUTHORIZED, 'Invalid OTP');
  }

  // success
  const updateData: Prisma.UserUpdateInput = {
    otpCode: null,
    otpExpiry: null,
    otpAttempts: 0,
    otpPurpose: null,
    otpRequestCount: 0,
    otpRequestReset: null,
  } as Prisma.UserUpdateInput;
  if (purpose === 'VERIFY') {
    (updateData as any).isVerified = true;
  }

  await AuthRepo.updateUserByEmail(email, updateData);

  // return tokens on verify (login flow expects tokens)
  const jwtPayload = {
    id: user.id,
    fullName: user.fullName as string,
    email: user.email as string,
    profilePic: user.profilePic,
    role: user.role as UserRole,
    isVerified: purpose === 'VERIFY' ? true : (user.isVerified as boolean),
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string
  );

  return { accessToken, refreshToken };
};

const verifyEmail = async (_token: string) => {
  throw new ApiError(
    status.BAD_REQUEST,
    'Legacy link-based verification removed. Use OTP-based `/auth/verify-otp`.'
  );
};

const verifyResetPassLink = async (_token: string) => {
  throw new ApiError(
    status.BAD_REQUEST,
    'Legacy link-based verification removed. Use OTP-based password reset flow.'
  );
};

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const user = await AuthRepo.findUserByEmail(email);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  if (!newPassword) {
    throw new ApiError(status.BAD_REQUEST, 'New password is required!');
  }

  if (!confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, 'Confirm password is required!');
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, 'New password and confirm password do not match!');
  }

  const isPasswordMatch = await passwordCompare(currentPassword, user.password as string);

  if (!isPasswordMatch) {
    throw new ApiError(status.UNAUTHORIZED, 'Current password is incorrect!');
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await AuthRepo.updatePasswordByEmail(email, hashedNewPassword);

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await AuthRepo.findUserByEmail(email);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  }

  if (!user.isVerified) {
    throw new ApiError(status.UNAUTHORIZED, 'User account is not verified!');
  }

  // send OTP for RESET purpose
  await sendOtp(email, 'RESET');

  return {
    message: 'We have sent a reset OTP to your email address. Please check your inbox.',
  };
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, 'Passwords do not match!');
  }

  // verify OTP
  await verifyOtp(email, otp, 'RESET');

  const hashedPassword = await hashPassword(newPassword);

  await AuthRepo.updatePasswordByEmail(email, hashedPassword);

  return {
    message: 'Password reset successfully!',
  };
};

const getMe = async (email: string) => {
  const result = await AuthRepo.getMeSelect(email);

  return result;
};

export const refreshToken = async (token: string) => {
  const decoded = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh.secret as string
  ) as RefreshPayload;

  const { email, iat } = decoded;

  const user = await AuthRepo.getUserForRefresh(email);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  /* Reject if password changed after token was issued */
  if (
    user.passwordChangedAt &&
    /* convert both to seconds since epoch */
    Math.floor(user.passwordChangedAt.getTime() / 1000) > iat
  ) {
    throw new ApiError(status.UNAUTHORIZED, 'Password was changed after this token was issued');
  }

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profilePic: user?.profilePic,
    isVerified: user.isVerified,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  return { accessToken };
};

export const AuthService = {
  getMe,
  loginUser,
  sendOtp,
  resendOtp,
  verifyOtp,
  refreshToken,
  resetPassword,
  changePassword,
  forgotPassword,
  verifyEmail,
  verifyResetPassLink,
};
