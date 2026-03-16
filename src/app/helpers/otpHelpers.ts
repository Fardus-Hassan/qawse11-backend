import bcrypt from 'bcryptjs';

export const generateNumericOtp = (digits = 6): string => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const compareOtp = async (otp: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(otp, hashed);
};

export const isOtpExpired = (expiry?: Date | null): boolean => {
  if (!expiry) return true;
  return new Date() > expiry;
};
