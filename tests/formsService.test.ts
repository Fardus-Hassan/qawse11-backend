import assert from 'assert';
import { FormsService } from '../src/app/modules/forms/forms.service';
import * as FormsRepo from '../src/app/repositories/forms.repository';

const run = async () => {
  // Case 1: no rows — use formatFormStats directly to avoid DB dependency
  const res1 = FormsService.formatFormStats([] as any);
  // should return three entries with zeros
  assert.strictEqual(res1.length, 3);
  res1.forEach((r: any) => {
    assert.strictEqual(r.totalSubmissions, 0);
    assert.strictEqual(r.uniqueUsers, 0);
  });

  // Case 2: some rows — feed sample rows directly to formatFormStats
  const res2 = FormsService.formatFormStats([
    { formType: 'GET_IN_TOUCH', totalSubmissions: 5, uniqueUsers: 3 },
    { formType: 'CONTACT', totalSubmissions: 2, uniqueUsers: 2 },
  ] as any);

  const map = Object.fromEntries(res2.map((r: any) => [r.formType, r]));
  assert.strictEqual(map.GET_IN_TOUCH.totalSubmissions, 5);
  assert.strictEqual(map.GET_IN_TOUCH.uniqueUsers, 3);
  assert.strictEqual(map.CONTACT.totalSubmissions, 2);
  assert.strictEqual(map.CONSULTATION.totalSubmissions, 0);

  console.log('Forms service tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
