import status from "http-status";
import { mailService } from "../mail/mail.service";
import prisma from "./prisma";
import AppError from "../errors/AppError";

export const sendOTP = async (userId: string) => {
    // Step 1️⃣: Generate OTP and expiry time
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Step 2️⃣: Upsert OTP
    const otp = await prisma.oTP.upsert({
        where: { userId },
        update: {
            otpCode,
            otpExpiresAt,
            updatedAt: new Date(),
        },
        create: {
            otpCode,
            otpExpiresAt,
            userId,
        },
    });

    // Step 3️⃣: Fetch user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found while sending OTP!");
    }

    // Step 4️⃣: Send OTP via email
    await mailService.sendEmail(user.email, otpCode, "Verify Your OTP within 10 Minutes");
    return {
        message: "OTP sent successfully",
        expiresAt: otp.otpExpiresAt,
    };
};
