import assert from 'assert';
import notFound from '../src/app/middlewares/notFound';
import AppError from '../src/app/errors/AppError';

const run = async () => {
  let captured: any = null;
  const next = (err?: any) => {
    captured = err;
  };

  notFound({} as any, {} as any, next as any);

  assert.ok(captured instanceof AppError, 'notFound should call next with AppError');
  assert.strictEqual(captured.statusCode, 404);
  assert.strictEqual(captured.message, 'API not found!');

  console.log('Middleware tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
