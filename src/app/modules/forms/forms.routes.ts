import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FormController } from './forms.controller';
import { FormValidation } from './forms.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/create-form', auth(), validateRequest(FormValidation.createFormSchema), FormController.createForm);

export const FormsRoutes = router;
