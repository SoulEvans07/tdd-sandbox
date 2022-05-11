import request from 'supertest';
import { app } from '../app';
import User from '../DAL/models/User';
import LocaleEn from '../locales/en/translation.json';
import { mockUser } from './mocks';
import { postRequest, postUser } from './testHelpers';

describe('Authorization', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
  });

  test('Login unsuccessful because user not found', async () => {
    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    resp = await postRequest('/api/1.0/auth/login', { username: 'badUserName', password: mockUser.password });
    expect(resp.status).toBe(403);
    expect(resp.body.message).toBe(LocaleEn.userNotFound);
  });

  test('Login unsuccessful because user password is bad', async () => {
    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    resp = await postRequest('/api/1.0/auth/login', { username: mockUser.username, password: 'password' });
    expect(resp.status).toBe(403);
    expect(resp.body.message).toBe(LocaleEn.userPasswordIsWrong);
  });

  test('Login successful', async () => {
    const validateTokenResponse = (response: request.Response) => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.id).toBe(1);
      expect(response.body.user).toHaveProperty('username');
      expect(response.body.user.username).toBe(user.username);
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).toHaveProperty('tenants');
      expect(response.body.user.tenants).toStrictEqual([1]);
      expect(response.body).toHaveProperty('token');
    };

    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);
    const user = users[0];

    resp = await postRequest('/api/1.0/auth/login', { username: mockUser.username, password: mockUser.password });
    validateTokenResponse(resp);

    resp = await postRequest('/api/1.0/auth/token', undefined, { authorization: 'Bearer ' + resp.body.token });
    validateTokenResponse(resp);
  });

  // TODO token expire test
});
