import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export type IJwtPayload = {
    id?: string;
    fullName?: string;
    email: string;
    profileImage?: string | null;
    role: UserRole
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
export const createToken = (
    jwtPayload: IJwtPayload,
    secret: string,
    expiresIn: string
) => {
    return jwt.sign(
        jwtPayload,
        secret as jwt.Secret,
        {
            expiresIn: expiresIn as string,
        } as jwt.SignOptions
    );
};