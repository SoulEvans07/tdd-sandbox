import { UserManager } from '../BLL/UserManager';
import Tenant from '../DAL/models/Tenant';
import User, { RestrictedUserOutput } from '../DAL/models/User';
import LocaleEn from '../locales/en/translation.json';
import { mockUser } from './mocks';
import { generateAuthorizationHeader, getUsers, loginUser, postUser } from './testHelpers';

describe('Users', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
    Tenant.drop();
    Tenant.sync();
  });

  describe('User registration', () => {
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

      test(`in use`, async () => {
        await User.create(mockUser);
        const response = await postUser(mockUser);
        expect(response.body.validationErrors.username).toBe(LocaleEn.usernameInUse);
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

      test(`in use`, async () => {
        await User.create(mockUser);
        const response = await postUser(mockUser);
        expect(response.body.validationErrors.email).toBe(LocaleEn.emailInUse);
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
      it('saves user to database', async () => {
        const resp = await postUser(mockUser);
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toBe(LocaleEn.userCreated);

        const users = await User.findAll();
        expect(users).toHaveLength(1);
        expect(users[0].username).toBe(mockUser.username);
        expect(users[0].email).toBe(mockUser.email);
        expect(users[0].password).not.toBe(mockUser.password);
      });
    });
  });

  test('get users list in tenant', async () => {
    const organization = '@snapsoft.hu';

    const testUser = { username: 'adam.szi', email: `adam.szi${organization}`, password: 'Pass123!' };
    const sameTenantUsers = [
      testUser,
      { username: 'andras.balogh', email: `andras.balogh${organization}`, password: 'Pass123!' },
      { username: 'tamas.horvath', email: `tamas.horvath${organization}`, password: 'Pass123!' },
    ];
    const users = [
      ...sameTenantUsers,
      { username: 'test.user', email: 'test.user@other.hu', password: 'Pass123!' },
      { username: 'other.user', email: 'other.user@other.hu', password: 'Pass123!' },
      { username: 'another.user', email: 'another.user@other.hu', password: 'Pass123!' },
    ];

    const savedUsers = [];
    for await (const user of users) {
      const savedUser = await UserManager.save(user);
      savedUsers.push(savedUser);
    }
    const expectedUsers: RestrictedUserOutput[] = savedUsers
      .filter(u => u.email.endsWith(organization))
      .map(u => ({ id: u.id, username: u.username, email: u.email }));

    const authData = await loginUser(testUser);
    const authHeader = generateAuthorizationHeader(authData);
    const res = await getUsers(authData.user.tenants[0], authHeader);
    expect(res.body).toEqual(expectedUsers);
  });
});
