import assert from 'assert';
import {
  generateNumericOtp,
  hashOtp,
  compareOtp,
  isOtpExpired,
} from '../src/app/helpers/otpHelpers';

const run = async () => {
  // OTP generation
  const otp = generateNumericOtp(6);
  assert.strictEqual(otp.length, 6, 'OTP should be 6 digits');
  assert.match(otp, /^[0-9]{6}$/, 'OTP must be numeric');

  // Hashing & compare
  const hashed = await hashOtp(otp);
  const isMatch = await compareOtp(otp, hashed);
  assert.strictEqual(isMatch, true, 'Hashed OTP should match original');

  // Expiry check
  const future = new Date(Date.now() + 1000 * 60 * 5);
  const past = new Date(Date.now() - 1000 * 60 * 5);
  assert.strictEqual(isOtpExpired(future), false, 'Future expiry should not be expired');
  assert.strictEqual(isOtpExpired(past), true, 'Past expiry should be expired');

  console.log('All OTP helper tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
