import {credentialInviteTemplate} from './index';

describe('Email Verification Template', () => {
  const template = credentialInviteTemplate(
    '123',
    'Testy McTestface',
    '1234',
    'http://localhost:3001'
  );

  console.log(template);

  it('should return a string', () => {
    expect(typeof template).toBe('string');
    expect.assertions(1);
  });
});
