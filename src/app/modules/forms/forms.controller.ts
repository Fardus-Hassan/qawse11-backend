import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FormsService } from './forms.service';

const submitGetInTouch = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const ip = req.headers['x-forwarded-for'] || req.ip;

  const result = await FormsService.submitGetInTouch(userId, req.body, String(ip || ''));

  sendResponse(res, {
    statusCode: status.CREATED,
    message: 'Form submitted successfully',
    data: result,
  });
});

const submitContact = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const ip = req.headers['x-forwarded-for'] || req.ip;

  const result = await FormsService.submitContact(userId, req.body, String(ip || ''));

  sendResponse(res, {
    statusCode: status.CREATED,
    message: 'Form submitted successfully',
    data: result,
  });
});

const submitConsultation = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const ip = req.headers['x-forwarded-for'] || req.ip;

  const result = await FormsService.submitConsultation(userId, req.body, String(ip || ''));

  sendResponse(res, {
    statusCode: status.CREATED,
    message: 'Form submitted successfully',
    data: result,
  });
});

const getForms = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const filter = req.query.filter as 'getInTouch' | 'contact' | 'consultation' | undefined;

  const result = await FormsService.getForms(page, limit, filter);

  sendResponse(res, {
    statusCode: status.OK,
    message: 'Forms retrieved successfully',
    data: result,
  });
});

const getFormsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = req.query.filter as 'getInTouch' | 'contact' | 'consultation' | undefined;

  const result = await FormsService.getFormsByUser(userId, filter);

  sendResponse(res, {
    statusCode: status.OK,
    message: 'User forms retrieved successfully',
    data: result,
  });
});

const getFormStats = catchAsync(async (_req, res) => {
  const result = await FormsService.getFormStats();

  sendResponse(res, {
    statusCode: status.OK,
    message: 'Form stats retrieved successfully',
    data: result,
  });
});

export const FormsController = {
  submitGetInTouch,
  submitContact,
  submitConsultation,
  getForms,
  getFormsByUser,
  getFormStats,
};
