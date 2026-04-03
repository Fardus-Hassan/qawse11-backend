import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FormService } from './forms.service';

const createForm = catchAsync(async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for']?.toString();

  const result = await FormService.createForm({
    ...req.body,
    ip,
  });

  sendResponse(res, {
    statusCode: status.CREATED,
    message: 'Form submitted successfully!',
    data: result,
  });
});

const sendBooking = catchAsync(async (req, res) => {
  const result = await FormService.sendBooking(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: 'Booking request sent successfully!',
    data: result,
  });

});

export const FormController = {
  createForm,
  sendBooking,
};

