import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FormsController } from './forms.controller';
import {
  getInTouchSchema,
  contactSchema,
  consultationSchema,
  getFormsQuerySchema,
  getFormsByUserSchema,
} from './forms.validation';
import { UserRole } from '@prisma/client';

const router = Router();

// Place routes at top-level so endpoints become /api/v1/getInTouch etc.
router.post(
  '/getInTouch',
  auth(),
  validateRequest(getInTouchSchema),
  FormsController.submitGetInTouch
);
router.post('/contact', auth(), validateRequest(contactSchema), FormsController.submitContact);
router.post(
  '/consultation',
  auth(),
  validateRequest(consultationSchema),
  FormsController.submitConsultation
);

router.get('/forms', auth(), validateRequest(getFormsQuerySchema), FormsController.getForms);

// Admin-only: form stats summary
router.get(
  '/forms/stats',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  FormsController.getFormStats
);

router.get(
  '/forms/:userId',
  auth(),
  validateRequest(getFormsByUserSchema),
  FormsController.getFormsByUser
);

export const FormsRoutes = router;
