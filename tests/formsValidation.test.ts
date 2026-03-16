import assert from 'assert';
import {
  getInTouchSchema,
  contactSchema,
  consultationSchema,
} from '../src/app/modules/forms/forms.validation';

const run = async () => {
  // valid getInTouch
  getInTouchSchema.parse({ body: { name: 'John', email: 'a@b.com', message: 'Hello' } });

  // invalid getInTouch
  let threw = false;
  try {
    getInTouchSchema.parse({ body: { name: '', email: 'bad', message: '' } });
  } catch (err) {
    threw = true;
  }
  assert.strictEqual(threw, true);

  // contact valid
  contactSchema.parse({
    body: {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'j@d.com',
      country: 'US',
      project_type: 'Web',
      budget_range: '$1000-$5000',
      message: 'Hi',
    },
  });

  // consultation valid
  consultationSchema.parse({
    body: {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'j@d.com',
      timeline: '1 month',
      country: 'US',
      project_type: 'App',
      budget_range: '$5000-$10000',
      helps: ['design', 'dev'],
      project_details: 'Details',
    },
  });

  console.log('Forms validation tests passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
