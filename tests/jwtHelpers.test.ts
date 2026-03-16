import assert from 'assert';
import { jwtHelpers } from '../src/app/helpers/jwtHelpers';

const secret = 'testsecret123';

const run = async () => {
  const payload = {
    id: '1',
    fullName: 'Test',
    email: 'a@b.com',
    role: 'USER',
    isVerified: true,
  } as any;

  const token = jwtHelpers.createToken(payload, secret, '1h');
  assert.strictEqual(typeof token, 'string');

  const decoded: any = jwtHelpers.verifyToken(token, secret);
  assert.strictEqual(decoded.email, payload.email);
  assert.strictEqual(decoded.role, payload.role);

  console.log('JWT helper tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
