import {emailVerificationTemplate} from './index';

describe('Email Verification Template', () => {
  const template = emailVerificationTemplate(
    '123',
    'Testy McTestface',
    'default email',
    '1234',
    'http://localhost:3000'
  );

  console.log(template);

  it('should return a string', () => {
    expect(typeof template).toBe('string');
    expect.assertions(1);
  });
});
