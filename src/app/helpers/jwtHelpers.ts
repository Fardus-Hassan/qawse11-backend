import { UserRole } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import status from 'http-status';
import AppError from '../errors/AppError';

export type IJwtPayload = {
  id?: string;
  fullName?: string;
  email: string;
  profilePic?: string | null;
  role: UserRole;
  isVerified: boolean;
};

const createToken = (jwtPayload: IJwtPayload, secret: string, expiresIn: string) => {
  return jwt.sign(
    jwtPayload,
    secret as jwt.Secret,
    {
      expiresIn: expiresIn as string,
    } as jwt.SignOptions
  );
};

const verifyToken = (token: string, secret = config.jwt.access_secret as string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(status.UNAUTHORIZED, 'JWT token is expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError(status.UNAUTHORIZED, 'Invalid JWT token');
    } else {
      throw new AppError(status.UNAUTHORIZED, 'Failed to verify token');
    }
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
