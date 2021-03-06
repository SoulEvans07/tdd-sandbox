import User from '../DAL/models/User';
import LocaleEn from '../locales/en/translation.json';
import { mockUser } from './mocks';
import { ApiEndpoints, postRequest, postUser, validateTokenResponse } from './testHelpers';

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

    resp = await postRequest(ApiEndpoints.Login, { username: 'badUserName', password: mockUser.password });
    expect(resp.status).toBe(403);
    expect(resp.body.message).toBe(LocaleEn.userNotFound);
  });

  test('Login unsuccessful because user password is bad', async () => {
    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    resp = await postRequest(ApiEndpoints.Login, { username: mockUser.username, password: 'password' });
    expect(resp.status).toBe(403);
    expect(resp.body.message).toBe(LocaleEn.userPasswordIsWrong);
  });

  test('Login successful', async () => {
    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);
    const user = users[0];

    resp = await postRequest(ApiEndpoints.Login, { username: mockUser.username, password: mockUser.password });
    validateTokenResponse(user, resp);

    resp = await postRequest(ApiEndpoints.GetToken, undefined, { authorization: 'Bearer ' + resp.body.token });
    validateTokenResponse(user, resp);
  });

  // TODO token expire test
});
