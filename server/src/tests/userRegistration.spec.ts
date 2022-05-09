import request from 'supertest';
import { app } from '../app';
import sequelize from '../DAL/database';
import User from '../DAL/models/User';
import LocaleEn from '../locales/en/translation.json';

describe('User registration', () => {
  const postUser = async (body?: any) => await request(app).post('/api/1.0/users').send(body);

  const dynamicErrorValidator = async (fieldName: string, value: undefined | string, errorMessage: string) => {
    const resp = await postUser({ [fieldName]: value });
    expect(resp.status).toBe(400);
    expect(resp.body.validationErrors[fieldName]).toBe(errorMessage);
  };

  test('empty body', async () => {
    const resp = await postUser();
    expect(resp.status).toBe(400);
    expect(resp.body.validationErrors).not.toBeUndefined();
  });

  describe('username', () => {
    test('required', async () => {
      const resp = await postUser({ username: undefined });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.username).toBe(LocaleEn.usernameRequired);
    });

    test('min length', async () => {
      const resp = await postUser({ username: 'a'.repeat(5) });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.username).toBe(LocaleEn.usernameLength);
    });

    test('max length', async () => {
      const resp = await postUser({ username: 'a'.repeat(33) });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.username).toBe(LocaleEn.usernameLength);
    });
  });

  describe('email', () => {
    test('required', async () => {
      const resp = await postUser({ email: undefined });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.email).toBe(LocaleEn.emailRequired);
    });

    test('valid email', async () => {
      const resp = await postUser({ email: 'a'.repeat(10) });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.email).toBe(LocaleEn.emailNotValid);
    });

    test.each([
      ['email', undefined, LocaleEn.emailRequired],
      ['email', '@mail.com', LocaleEn.emailNotValid],
      ['email', 'user.mail.com', LocaleEn.emailNotValid],
      ['email', 'user@com', LocaleEn.emailNotValid],
    ])('%s validation: %s', dynamicErrorValidator);
  });

  describe('password', () => {
    test('required', async () => {
      const resp = await postUser({ password: undefined });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.password).toBe(LocaleEn.passwordRequired);
    });

    test('min length', async () => {
      const resp = await postUser({ password: 'a'.repeat(7) });
      expect(resp.status).toBe(400);
      expect(resp.body.validationErrors.password).toBe(LocaleEn.passwordLength);
    });

    test.each([
      ['password', 'alllowercase', LocaleEn.passwordPattern],
      ['password', 'ALLUPPERCASE', LocaleEn.passwordPattern],
      ['password', '1234567890', LocaleEn.passwordPattern],
      ['password', 'lowerandUPPER', LocaleEn.passwordPattern],
      ['password', 'lower4nd5667', LocaleEn.passwordPattern],
      ['password', 'UPPER44444', LocaleEn.passwordPattern],
    ])('%s strength test: %s', dynamicErrorValidator);
  });

  describe('database actions', () => {
    beforeEach(() => {
      User.drop();
      User.sync();
    });

    it('saves user to database', async () => {
      const mockUser = { username: 'adam.szi', email: 'adam.szi@snapsoft.hu', password: 'Password123!' };
      const resp = await postUser(mockUser);
      expect(resp.status).toBe(200);

      const users = await User.findAll();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe(mockUser.username);
      expect(users[0].email).toBe(mockUser.email);
      expect(users[0].password).not.toBe(mockUser.password);
    });
  });
});
