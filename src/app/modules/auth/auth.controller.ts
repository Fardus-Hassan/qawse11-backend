import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';


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

const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.resendOTP(email);

  sendResponse(res, {
    statusCode: status.OK,
    message: "New Otp sent!",
    data: result
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const result = await AuthService.verifyOtp(email, otp);

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

  const { currentPassword, newPassword } = req.body;

  await AuthService.changePassword(email, currentPassword, newPassword);

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
  const { id } = req.user;
  const { newPassword, confirmPassword } = req.body;

  await AuthService.resetPassword(id, newPassword, confirmPassword);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Password reseted",
  });
});
const sendCustomerSupportEmail = catchAsync(async (req, res) => {
  const payload = req.body;

  await AuthService.sendCustomerSupportEmail(payload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "You form submitted successful!",
  });
});
export const AuthController = {
  login,
  resendOtp,
  verifyOtp,
  resetPassword,
  forgotPassword,
  changePassword,
  sendCustomerSupportEmail
};
