import { UserRole } from '@prisma/client';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();


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
  auth(),
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.post(
  '/send-support-mail',
  auth(),
  validateRequest(AuthValidation.customerSupportValidationSchema),
  AuthController.sendCustomerSupportEmail
);

export const AuthRoutes = router;
