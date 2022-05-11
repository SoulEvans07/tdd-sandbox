import Task, { TaskOutput, TaskStatus } from '../DAL/models/Task';
import Tenant, { TenantOutput } from '../DAL/models/Tenant';
import User from '../DAL/models/User';
import { AuthResponse } from '../types/api';
import { mockUser } from './mocks';
import { postRequest, postUser, validateTokenResponse } from './testHelpers';

describe('Tasks', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
    Tenant.drop();
    Tenant.sync();
    Task.drop();
    Task.sync();
  });

  const getLoggedInUser = async (): Promise<AuthResponse & { tenants: TenantOutput[] }> => {
    const emailPostFix = mockUser.email.split('@')[1];

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

    return {
      ...resp.body,
      tenants,
    };
  };

  function validateTaskResponseSchema(task: TaskOutput) {
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('description');
    expect(task).toHaveProperty('order');
    expect(task).toHaveProperty('status');
    expect(task).toHaveProperty('createdAt');
    expect(task).toHaveProperty('updatedAt');
  }

  test('Create personal task', async () => {
    const loginData = await getLoggedInUser();

    const taskInput = {
      title: 'New task for personal',
      description: 'Description for task',
    };

    const resp = await postRequest('/api/1.0/tasks', taskInput, { authorization: 'Bearer ' + loginData.token });
    const task: TaskOutput = resp.body;

    validateTaskResponseSchema(task);
    expect(task.assigneeId).toBe(loginData.user.id);
    expect(task.tenantId).toBeFalsy();
    expect(task.parentId).toBeFalsy();
    expect(task.order).toBe(1);
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.title).toBe(taskInput.title);
    expect(task.description).toBe(taskInput.description);
  });

  test('Create tenant task', async () => {
    const loginData = await getLoggedInUser();

    const taskInput = {
      title: 'New task for tenant',
      description: 'Description for task',
      tenantId: loginData.user.tenants[0],
    };

    const resp = await postRequest('/api/1.0/tasks', taskInput, { authorization: 'Bearer ' + loginData.token });
    const task: TaskOutput = resp.body;
    validateTaskResponseSchema(task);
    expect(task.assigneeId).toBeFalsy();
    expect(task.tenantId).toBe(taskInput.tenantId);
    expect(task.parentId).toBeFalsy();
    expect(task.order).toBe(1);
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.title).toBe(taskInput.title);
    expect(task.description).toBe(taskInput.description);
  });
});
