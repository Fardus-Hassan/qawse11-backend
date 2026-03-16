import assert from 'assert';
import {
  generateNumericOtp,
  hashOtp,
  compareOtp,
  isOtpExpired,
} from '../src/app/helpers/otpHelpers';

const run = async () => {
  // Setup
  const otp = generateNumericOtp(6);
  const hashed = await hashOtp(otp);
  const expiry = new Date(Date.now() + 1000 * 60 * 5);
  let attempts = 0;

  // Correct OTP verification
  const ok = await compareOtp(otp, hashed);
  assert.strictEqual(ok, true, 'Correct OTP should verify');

  // After success, clear OTP (simulate)
  let otpCode: string | null = null;
  let otpExpiry: Date | null = null;
  otpCode = null;
  otpExpiry = null;
  assert.strictEqual(otpCode, null);

  // Wrong OTP increases attempts
  const wrong = await compareOtp('000000', hashed);
  if (!wrong) {
    attempts++;
  }
  assert.strictEqual(attempts, 1, 'Attempts should increment on wrong OTP');

  // Expired OTP
  const past = new Date(Date.now() - 1000 * 60 * 5);
  assert.strictEqual(isOtpExpired(past), true, 'Past expiry should be expired');

  console.log('OTP flow simulation tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
