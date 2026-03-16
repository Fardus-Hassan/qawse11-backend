import assert from 'assert';
import { AuthController } from '../src/app/modules/auth/auth.controller';
import AppError from '../src/app/errors/AppError';

const run = async () => {
  // verifyEmail
  let captured: any = null;
  await new Promise<void>((resolve) => {
    const req = {} as any;
    const res = {} as any;
    const next = (err?: any) => {
      captured = err;
      resolve();
    };

    (AuthController.verifyEmail as any)(req, res, next);
  });

  assert.ok(captured instanceof AppError);
  assert.strictEqual(captured.statusCode, 400);

  // verifyResetPassLink
  captured = null;
  await new Promise<void>((resolve) => {
    const req = {} as any;
    const res = {} as any;
    const next = (err?: any) => {
      captured = err;
      resolve();
    };

    (AuthController.verifyResetPassLink as any)(req, res, next);
  });

  assert.ok(captured instanceof AppError);
  assert.strictEqual(captured.statusCode, 400);

  // resendVerificationLink
  captured = null;
  await new Promise<void>((resolve) => {
    const req = {} as any;
    const res = {} as any;
    const next = (err?: any) => {
      captured = err;
      resolve();
    };

    (AuthController.resendVerificationLink as any)(req, res, next);
  });

  assert.ok(captured instanceof AppError);
  assert.strictEqual(captured.statusCode, 400);

  // resendResetPassLink
  captured = null;
  await new Promise<void>((resolve) => {
    const req = {} as any;
    const res = {} as any;
    const next = (err?: any) => {
      captured = err;
      resolve();
    };

    (AuthController.resendResetPassLink as any)(req, res, next);
  });

  assert.ok(captured instanceof AppError);
  assert.strictEqual(captured.statusCode, 400);

  console.log('Auth controller tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
