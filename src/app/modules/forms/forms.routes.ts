import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FormController } from './forms.controller';
import { FormValidation } from './forms.validation';

const router = Router();

router.post('/create-form', validateRequest(FormValidation.createFormSchema), FormController.createForm);

export const FormsRoutes = router;
