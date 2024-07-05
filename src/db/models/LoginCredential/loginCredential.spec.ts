import LoginCredential, {LoginCredentialsCreationAttributes} from './';

describe('LoginCredential', () => {
  let loginCredential: LoginCredential;
  it('should be defined', () => {
    expect(LoginCredential).toBeDefined();
  });

  it('should create a login credential', async () => {
    loginCredential = await LoginCredential.create({
      supervisor_id: 1,
      email: 'testuser@test.com',
      password: 'testpassword'
    } as LoginCredentialsCreationAttributes);

    expect(loginCredential).toBeDefined();
  });

  it('should have an id', () => {
    expect(loginCredential.id).toBeDefined();
    expect(loginCredential.id).toBeGreaterThan(0);
    expect.assertions(2);
  });

  it('should have a supervisor_id', () => {
    expect(loginCredential.supervisor_id).toBeDefined();
    expect(loginCredential.supervisor_id).toBeGreaterThan(0);
    expect.assertions(2);
  });

  it('should have an email', () => {
    expect(loginCredential.email).toBeDefined();
    expect(loginCredential.email).toBe('testuser@test.com');
    expect.assertions(2);
  });

  it('should have a password', () => {
    expect(loginCredential.password).toBeDefined();
    expect.assertions(1);
  });

  it('should have a hashed password', () => {
    expect(loginCredential.password).not.toBe('testpassword');
    expect(loginCredential.password.includes('$2b$')).toBe(true);
    expect.assertions(2);
  });

  it('should have a createdAt date', () => {
    expect(loginCredential.createdAt).toBeDefined();
    expect(loginCredential.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('should have an updatedAt date', () => {
    expect(loginCredential.updatedAt).toBeDefined();
    expect(loginCredential.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });
});
