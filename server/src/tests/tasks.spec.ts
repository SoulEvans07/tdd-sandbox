import Task, { TaskInput, TaskOutput, TaskStatus } from '../DAL/models/Task';
import Tenant, { TenantOutput } from '../DAL/models/Tenant';
import User from '../DAL/models/User';
import { AuthResponse } from '../types/api';
import { mockUser } from './mocks';
import { postRequest, postUser, validateTokenResponse } from './testHelpers';
import LocaleEn from '../locales/en/translation.json';

describe('Tasks', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
    Tenant.drop();
    Tenant.sync();
    Task.drop();
    Task.sync();
  });

  async function getLoggedInUser(): Promise<AuthResponse & { tenants: TenantOutput[] }> {
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
  }

  function validateTaskResponseSchema(task: TaskOutput) {
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('description');
    expect(task).toHaveProperty('order');
    expect(task).toHaveProperty('status');
    expect(task).toHaveProperty('createdAt');
    expect(task).toHaveProperty('updatedAt');
  }

  function validateTenantTask(task: TaskOutput, taskInput: TaskInput, order: number) {
    validateTaskResponseSchema(task);
    expect(task.assigneeId).toBeFalsy();
    expect(task.tenantId).toBe(taskInput.tenantId);
    expect(task.parentId).toBeFalsy();
    expect(task.order).toBe(order);
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.title).toBe(taskInput.title);
    expect(task.description).toBe(taskInput.description);
  }

  function validatePersonalTask(
    task: TaskOutput,
    loginData: AuthResponse & { tenants: TenantOutput[] },
    taskInputPersonal: TaskInput,
    order: number
  ) {
    validateTaskResponseSchema(task);
    expect(task.assigneeId).toBe(loginData.user.id);
    expect(task.tenantId).toBeFalsy();
    expect(task.parentId).toBeFalsy();
    expect(task.order).toBe(order);
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.title).toBe(taskInputPersonal.title);
    expect(task.description).toBe(taskInputPersonal.description);
  }

  const taskInputPersonal = {
    title: 'New task for personal',
    description: 'Description for task',
  };

  describe('Create task', () => {
    test('Personal', async () => {
      const loginData = await getLoggedInUser();
      const resp = await postRequest('/api/1.0/tasks', taskInputPersonal, {
        authorization: 'Bearer ' + loginData.token,
      });
      const task: TaskOutput = resp.body;
      validatePersonalTask(task, loginData, taskInputPersonal, 1);
    });

    test('Tenant', async () => {
      const loginData = await getLoggedInUser();
      const taskInput = {
        title: 'New task for tenant',
        description: 'Description for task',
        tenantId: loginData.user.tenants[0],
      };
      const resp = await postRequest('/api/1.0/tasks', taskInput, { authorization: 'Bearer ' + loginData.token });
      const task: TaskOutput = resp.body;
      validateTenantTask(task, taskInput, 1);
    });

    test('Task order', async () => {
      const loginData = await getLoggedInUser();
      const taskInputTenant = {
        title: 'New task for tenant',
        description: 'Description for task',
        tenantId: loginData.user.tenants[0],
      };

      let resp = await postRequest('/api/1.0/tasks', taskInputPersonal, {
        authorization: 'Bearer ' + loginData.token,
      });
      let task: TaskOutput = resp.body;
      validatePersonalTask(task, loginData, taskInputPersonal, 1);

      resp = await postRequest('/api/1.0/tasks', taskInputTenant, { authorization: 'Bearer ' + loginData.token });
      task = resp.body;
      validateTenantTask(task, taskInputTenant, 1);

      resp = await postRequest('/api/1.0/tasks', taskInputTenant, { authorization: 'Bearer ' + loginData.token });
      task = resp.body;
      validateTenantTask(task, taskInputTenant, 2);

      resp = await postRequest('/api/1.0/tasks', taskInputPersonal, {
        authorization: 'Bearer ' + loginData.token,
      });
      task = resp.body;
      validatePersonalTask(task, loginData, taskInputPersonal, 2);
    });
  });

  describe('Validation', () => {
    test.each`
      testName          | property         | value              | exceptedMessage
      ${'required'}     | ${'title'}       | ${undefined}       | ${LocaleEn.titleRequiredForTask}
      ${'length short'} | ${'title'}       | ${'s'}             | ${LocaleEn.titleLengthForTask}
      ${'length short'} | ${'title'}       | ${'ss'}            | ${LocaleEn.titleLengthForTask}
      ${'length long'}  | ${'title'}       | ${'s'.repeat(201)} | ${LocaleEn.titleLengthForTask}
      ${'required'}     | ${'description'} | ${undefined}       | ${LocaleEn.descriptionRequiredForTask}
    `(
      '$property $testName',
      async ({
        property,
        value,
        exceptedMessage,
      }: {
        testName: string;
        property: string;
        value: any;
        exceptedMessage: string;
      }) => {
        const loginData = await getLoggedInUser();
        const resp = await postRequest(
          '/api/1.0/tasks',
          { ...taskInputPersonal, [property]: value },
          { authorization: 'Bearer ' + loginData.token }
        );
        expect(resp.status).toBe(400);
        expect(resp.body.validationErrors[property]).toBe(exceptedMessage);
      }
    );
  });
});
