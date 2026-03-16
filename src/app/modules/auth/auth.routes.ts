import { UserRole } from '@prisma/client';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post('/send-otp', validateRequest(AuthValidation.sendOtpSchema), AuthController.sendOtp);

router.post('/resend-otp', validateRequest(AuthValidation.sendOtpSchema), AuthController.resendOtp);

router.post(
  '/verify-otp',
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyOtp
);

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthController.login);

router.put(
  '/change-password',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.get('/me', auth(), AuthController.getMe);

router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;
