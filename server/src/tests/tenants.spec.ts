import Tenant from '../DAL/models/Tenant';
import User from '../DAL/models/User';
import { mockUser } from './mocks';
import { getRequest, postRequest, postUser, validateTokenResponse } from './testHelpers';

describe('Tenants', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
    Tenant.drop();
    Tenant.sync();
  });

  const emailPostFix = mockUser.email.split('@')[1];

  test('Tenant created for user if it not exists', async () => {
    const resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    const tenants = await Tenant.findAll();
    expect(tenants).toHaveLength(1);
    expect(tenants[0].name).toBe(emailPostFix);
    expect(tenants[0].id).toBe(users[0].tenantId);
  });

  test('Tenant not created if it exists for user', async () => {
    const otherUsername = 'test.elek';
    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);
    resp = await postUser({
      username: otherUsername,
      email: otherUsername + '@' + emailPostFix,
      password: mockUser.password,
    });
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(2);

    const tenants = await Tenant.findAll();
    expect(tenants).toHaveLength(1);
    expect(tenants[0].name).toBe(emailPostFix);
    expect(tenants[0].id).toBe(users[0].tenantId);
  });

  test('Get tenants for user', async () => {
    let resp = await postUser(mockUser);
    expect(resp.status).toBe(200);

    const users = await User.findAll();
    expect(users).toHaveLength(1);

    const tenants = await Tenant.findAll();
    expect(tenants).toHaveLength(1);
    expect(tenants[0].name).toBe(emailPostFix);
    expect(tenants[0].id).toBe(users[0].tenantId);

    resp = await postRequest('/api/1.0/auth/login', { username: mockUser.username, password: mockUser.password });
    validateTokenResponse(users[0], resp);

    resp = await getRequest('/api/1.0/tenants/user', { authorization: 'Bearer ' + resp.body.token });
    expect(resp.body).toHaveLength(1);

    const tenant = resp.body[0];
    const user = users[0];
    expect(tenant).toHaveProperty('id');
    expect(tenant.id).toBe(user.tenantId);
    expect(tenant).toHaveProperty('name');
    expect(tenant.name).toBe(emailPostFix);
  });
});
