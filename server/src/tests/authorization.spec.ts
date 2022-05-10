import request from 'supertest';
import { app } from '../app';
import User from '../DAL/models/User';
import LocaleEn from '../locales/en/translation.json';

describe('Authorization', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
  });

  const mockUser = { username: 'adam.szi', email: 'adam.szi@snapsoft.hu', password: 'Password123!' };

  const postUser = async (path: string, body: any) => await request(app).post(path).send(body);

  test('Login unsuccessful because user not found', async () => {
    let resp = await postUser('/api/1.0/users', mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    resp = await postUser('/api/1.0/auth/login', { username: 'badUserName', password: mockUser.password });
    expect(resp.status).toBe(403);
    expect(resp.body.message).toBe(LocaleEn.userNotFound);
  });

  test('Login unsuccessful because user password is bad', async () => {
    let resp = await postUser('/api/1.0/users', mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    resp = await postUser('/api/1.0/auth/login', { username: mockUser.username, password: 'password' });
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
      expect(response.body).toHaveProperty('token');
    };

    let resp = await postUser('/api/1.0/users', mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);
    const user = users[0];

    resp = await postUser('/api/1.0/auth/login', { username: mockUser.username, password: mockUser.password });
    validateTokenResponse(resp);

    resp = await await request(app)
      .post('/api/1.0/auth/token')
      .set('authorization', 'Bearer ' + resp.body.token)
      .send();
    validateTokenResponse(resp);
  });

  // TODO token expire test
});
