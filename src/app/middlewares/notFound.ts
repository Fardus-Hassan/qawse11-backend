import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'API not found!'));
};

export default notFound;
