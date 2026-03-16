import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { AuthService } from './auth.service';

// Legacy link-based endpoints removed. Use OTP endpoints instead.
const verifyEmail = catchAsync(async (_req, _res) => {
  throw new AppError(400, 'Legacy link-based verification removed. Use OTP-based /auth/verify-otp');
});

const verifyResetPassLink = catchAsync(async (_req, _res) => {
  throw new AppError(
    400,
    'Legacy link-based reset verification removed. Use OTP-based password reset flow'
  );
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // config.NODE_ENV === "production"
    sameSite: 'lax', // config.NODE_ENV === "production" ? true : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: 'User logged in successfully!',
    data: { accessToken },
  });
});

const sendOtp = catchAsync(async (req, res) => {
  const { email, purpose } = req.body;

  const result = await AuthService.sendOtp(email, purpose || 'VERIFY');

  sendResponse(res, {
    statusCode: status.OK,
    message: result.message,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const { email, purpose } = req.body;

  const result = await AuthService.resendOtp(email, purpose || 'VERIFY');

  sendResponse(res, {
    statusCode: status.OK,
    message: result.message,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp, purpose } = req.body;

  const result = await AuthService.verifyOtp(email, otp, purpose || 'VERIFY');

  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // config.NODE_ENV === "production"
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: 'OTP verified successfully! You are now authenticated.',
    data: { accessToken },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const email = req.user?.email as string;

  const { currentPassword, newPassword, confirmPassword } = req.body;

  await AuthService.changePassword(email, currentPassword, newPassword, confirmPassword);

  sendResponse(res, {
    statusCode: status.OK,
    message: 'User password changed successfully!',
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    statusCode: status.OK,
    message: result.message,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  const result = await AuthService.resetPassword(email, otp, newPassword, confirmPassword);

  sendResponse(res, {
    statusCode: status.OK,
    message: result.message,
  });
});

// legacy resends removed. Use /auth/resend-otp instead.
const resendVerificationLink = catchAsync(async (_req, _res) => {
  throw new AppError(
    400,
    'Legacy link-based resend removed. Use /auth/send-otp or /auth/resend-otp'
  );
});

const resendResetPassLink = catchAsync(async (_req, _res) => {
  throw new AppError(
    400,
    'Legacy link-based resend removed. Use /auth/send-otp or /auth/resend-otp'
  );
});

const getMe = catchAsync(async (req, res) => {
  const email = req.user?.email as string;

  const result = await AuthService.getMe(email);

  sendResponse(res, {
    statusCode: status.OK,
    message: 'User fetched successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

export const AuthController = {
  login,
  getMe,
  sendOtp,
  resendOtp,
  verifyOtp,
  refreshToken,
  resetPassword,
  forgotPassword,
  changePassword,
  verifyEmail,
  verifyResetPassLink,
  resendResetPassLink,
  resendVerificationLink,
};
