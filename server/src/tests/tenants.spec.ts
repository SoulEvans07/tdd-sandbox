import Tenant from '../DAL/models/Tenant';
import User from '../DAL/models/User';
import { mockUser } from './mocks';
import { postUser } from './testHelpers';

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
});
