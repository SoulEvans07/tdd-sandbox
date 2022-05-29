import Task, { TaskInput, TaskOutput, TaskStatus } from '../DAL/models/Task';
import Tenant, { TenantOutput } from '../DAL/models/Tenant';
import User, { UserInput } from '../DAL/models/User';
import { AuthResponse } from '../types/api';
import { mockUser } from './mocks';
import { ApiEndpoints, deleteRequest, getRequest, patchRequest, postRequest, postUser } from './testHelpers';
import LocaleEn from '../locales/en/translation.json';
import { TaskManager } from '../BLL/TaskManager';

describe('Tasks', () => {
  beforeEach(() => {
    User.drop();
    User.sync();
    Tenant.drop();
    Tenant.sync();
    Task.drop();
    Task.sync();
  });

  type LoginData = AuthResponse & { tenants: TenantOutput[] };

  async function getLoggedInUser(userInput: UserInput = mockUser): Promise<AuthResponse & { tenants: TenantOutput[] }> {
    let resp = await postUser(userInput);
    expect(resp.status).toBe(200);

    const user = await User.findOne({ where: { username: userInput.username } });
    if (!user) throw new Error();
    expect(user).toBeTruthy();

    const tenants = await Tenant.findAll();
    const userTenants = tenants.filter(o => o.id === user.tenantId);

    resp = await postRequest(ApiEndpoints.Login, { username: userInput.username, password: userInput.password });

    return {
      ...resp.body,
      tenants: userTenants,
    };
  }

  async function patchTask(taskId: number | string, patch: Partial<TaskInput>, loginData: LoginData) {
    return await patchRequest(
      ApiEndpoints.EditTask.replace(':id', taskId.toString()),
      patch,
      generateAuthorizationHeader(loginData)
    );
  }

  function generateAuthorizationHeader(loginData: LoginData): Record<string, string> | undefined {
    return { authorization: 'Bearer ' + loginData.token };
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

  function compareTasks(task: TaskOutput, compareWith: TaskOutput) {
    validateTaskResponseSchema(task);
    expect(task.id).toBe(compareWith.id);
    expect(task.title).toBe(compareWith.title);
    expect(task.description).toBe(compareWith.description);
    expect(task.order).toBe(compareWith.order);
    expect(task.status).toBe(compareWith.status);
    expect(task.assigneeId).toBe(compareWith.assigneeId);
    expect(task.parentId).toBe(compareWith.parentId);
    expect(task.tenantId).toBe(compareWith.tenantId);
    expect(task.createdAt).toBe(compareWith.createdAt);
    expect(task.deletedAt).toBe(compareWith.deletedAt);
  }

  const taskInputPersonal = {
    title: 'New task for personal',
    description: 'Description for task',
  };

  describe('Create task', () => {
    test('Personal', async () => {
      const loginData = await getLoggedInUser();
      const resp = await postRequest(
        ApiEndpoints.CreateTask,
        taskInputPersonal,
        generateAuthorizationHeader(loginData)
      );
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
      const resp = await postRequest(ApiEndpoints.CreateTask, taskInput, generateAuthorizationHeader(loginData));
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

      let resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, generateAuthorizationHeader(loginData));
      let task: TaskOutput = resp.body;
      validatePersonalTask(task, loginData, taskInputPersonal, 1);

      resp = await postRequest(ApiEndpoints.CreateTask, taskInputTenant, generateAuthorizationHeader(loginData));
      task = resp.body;
      validateTenantTask(task, taskInputTenant, 1);

      resp = await postRequest(ApiEndpoints.CreateTask, taskInputTenant, generateAuthorizationHeader(loginData));
      task = resp.body;
      validateTenantTask(task, taskInputTenant, 2);

      resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, generateAuthorizationHeader(loginData));
      task = resp.body;
      validatePersonalTask(task, loginData, taskInputPersonal, 2);
    });

    describe('Validation', () => {
      test.each`
        testName          | property   | value              | exceptedMessage
        ${'required'}     | ${'title'} | ${undefined}       | ${LocaleEn.titleRequiredForTask}
        ${'length short'} | ${'title'} | ${'s'}             | ${LocaleEn.titleLengthForTask}
        ${'length short'} | ${'title'} | ${'ss'}            | ${LocaleEn.titleLengthForTask}
        ${'length long'}  | ${'title'} | ${'s'.repeat(201)} | ${LocaleEn.titleLengthForTask}
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
            ApiEndpoints.CreateTask,
            { ...taskInputPersonal, [property]: value },
            generateAuthorizationHeader(loginData)
          );
          expect(resp.status).toBe(400);
          expect(resp.body.validationErrors[property]).toBe(exceptedMessage);
        }
      );
    });
  });

  describe('Task bulk actions', () => {
    test('Task list', async () => {
      const loginData1 = await getLoggedInUser();
      const user1Auth = generateAuthorizationHeader(loginData1);
      const loginData2 = await getLoggedInUser({
        username: 'user___2',
        email: 'user2@email.com',
        password: 'Password1234!',
      });
      const user2Auth = generateAuthorizationHeader(loginData2);

      const taskInputTenant = {
        title: 'New task for tenant',
        description: 'Description for task',
      };

      const user1TaskInputTenant = {
        ...taskInputTenant,
        tenantId: loginData1.user.tenants[0],
      };
      let resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, user1Auth);
      const user1PersonalTask1: TaskOutput = resp.body;
      validatePersonalTask(user1PersonalTask1, loginData1, taskInputPersonal, 1);
      resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, user1Auth);
      const user1PersonalTask2: TaskOutput = resp.body;
      validatePersonalTask(user1PersonalTask2, loginData1, taskInputPersonal, 2);
      resp = await postRequest(ApiEndpoints.CreateTask, user1TaskInputTenant, user1Auth);
      const user1TenantTask1: TaskOutput = resp.body;
      validateTenantTask(user1TenantTask1, user1TaskInputTenant, 1);

      const user2TaskInputTenant = {
        ...taskInputTenant,
        tenantId: loginData2.user.tenants[0],
      };
      resp = await postRequest(ApiEndpoints.CreateTask, user2TaskInputTenant, user2Auth);
      const user2TenantTask1: TaskOutput = resp.body;
      validateTenantTask(user2TenantTask1, user2TaskInputTenant, 1);
      resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, user2Auth);
      const user2PersonalTask1: TaskOutput = resp.body;
      validatePersonalTask(user2PersonalTask1, loginData2, taskInputPersonal, 1);

      resp = await getRequest(ApiEndpoints.TaskList.replace('/:tenantId', ''), user1Auth);
      expect(resp.status).toBe(200);
      expect(resp.body).toHaveLength(2);
      let tasks: TaskOutput[] = resp.body;
      let task = tasks.find(o => o.id === user1PersonalTask1.id);
      expect(task).toBeTruthy();
      task = tasks.find(o => o.id === user1PersonalTask2.id);
      expect(task).toBeTruthy();

      resp = await getRequest(
        ApiEndpoints.TaskList.replace(':tenantId', loginData1.user.tenants[0].toString()),
        user1Auth
      );
      expect(resp.status).toBe(200);
      expect(resp.body).toHaveLength(1);
      tasks = resp.body;
      task = tasks.find(o => o.id === user1TenantTask1.id);
      expect(task).toBeTruthy();

      resp = await getRequest(ApiEndpoints.TaskList.replace('/:tenantId', ''), user2Auth);
      expect(resp.status).toBe(200);
      expect(resp.body).toHaveLength(1);
      tasks = resp.body;
      task = tasks.find(o => o.id === user2PersonalTask1.id);
      expect(task).toBeTruthy();

      resp = await getRequest(
        ApiEndpoints.TaskList.replace(':tenantId', loginData2.user.tenants[0].toString()),
        user2Auth
      );
      expect(resp.status).toBe(200);
      expect(resp.body).toHaveLength(1);
      tasks = resp.body;
      task = tasks.find(o => o.id === user2TenantTask1.id);
      expect(task).toBeTruthy();

      resp = await getRequest(ApiEndpoints.TaskList.replace(':tenantId', '666'), user2Auth);
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe(LocaleEn.forbidden);
    });

    test('Remove tasks', async () => {
      const checkTaskList = async (
        haveToLength: number,
        userAuth: Record<string, string> | undefined,
        tenantId?: number
      ) => {
        const resp = await getRequest(
          ApiEndpoints.TaskList.replace(':tenantId', tenantId ? tenantId.toString() : ''),
          userAuth
        );
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveLength(haveToLength);
      };

      const user2Name = 'user___2';
      const loginData1 = await getLoggedInUser();
      const loginData2 = await getLoggedInUser({
        username: user2Name,
        email: 'user2@email.com',
        password: 'Password1234!',
      });
      const user1Auth = generateAuthorizationHeader(loginData1);
      const user2Auth = generateAuthorizationHeader(loginData2);
      const user1 = await User.findOne({ where: { username: mockUser.username } });
      const user2 = await User.findOne({ where: { username: user2Name } });

      if (!user1) throw Error();
      if (!user2) throw Error();

      const tenantTaskInputForUser1 = {
        title: 'New task for tenant',
        description: 'Description for task',
        tenantId: loginData1.user.tenants[0],
      };
      const tenantTaskInputForUser2 = {
        title: 'New task for tenant',
        description: 'Description for task',
        tenantId: loginData2.user.tenants[0],
      };

      const personalTaskIdsForUser1: number[] = [];
      const tenantTaskIdsForUser1: number[] = [];
      const personalTaskIdsForUser2: number[] = [];
      const tenantTaskIdsForUser2: number[] = [];

      for (let index = 0; index < 10; index++) {
        personalTaskIdsForUser1.push((await TaskManager.createTask(taskInputPersonal, user1)).id);
        tenantTaskIdsForUser1.push((await TaskManager.createTask(tenantTaskInputForUser1, user1)).id);
        personalTaskIdsForUser2.push((await TaskManager.createTask(taskInputPersonal, user2)).id);
        tenantTaskIdsForUser2.push((await TaskManager.createTask(tenantTaskInputForUser2, user2)).id);
      }

      await checkTaskList(10, user1Auth);
      await checkTaskList(10, user1Auth, loginData1.user.tenants[0]);
      await checkTaskList(10, user2Auth);
      await checkTaskList(10, user2Auth, loginData2.user.tenants[0]);

      let resp = await deleteRequest(
        ApiEndpoints.DeleteTasks,
        [...personalTaskIdsForUser1, ...tenantTaskIdsForUser1],
        user1Auth
      );
      expect(resp.status).toBe(200);
      expect(resp.body.message).toBe(LocaleEn.deleteSuccessful);

      await checkTaskList(0, user1Auth);
      await checkTaskList(0, user1Auth, loginData1.user.tenants[0]);
      await checkTaskList(10, user2Auth);
      await checkTaskList(10, user2Auth, loginData2.user.tenants[0]);

      resp = await deleteRequest(
        ApiEndpoints.DeleteTasks,
        [...personalTaskIdsForUser2, ...tenantTaskIdsForUser2],
        user1Auth
      );
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe(LocaleEn.forbidden);

      await checkTaskList(10, user2Auth);
      await checkTaskList(10, user2Auth, loginData2.user.tenants[0]);
    });
  });

  describe('Task edit', () => {
    test('URL param.id !== body.id', async () => {
      const loginData = await getLoggedInUser();
      const resp = await patchTask('1', { id: 2 }, loginData);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe(LocaleEn.badRequest);
    });

    test('Task not found', async () => {
      const loginData = await getLoggedInUser();
      const resp = await patchTask('1', { id: 1 }, loginData);
      expect(resp.status).toBe(404);
      expect(resp.body.message).toBe(LocaleEn.taskNotFound);
    });

    test('Task forbidden', async () => {
      const loginData = await getLoggedInUser();
      const loginData2 = await getLoggedInUser({
        username: 'user2Name',
        email: 'user2@email.com',
        password: 'Password1234!',
      });

      let resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, generateAuthorizationHeader(loginData));
      const personalTask: TaskOutput = resp.body;
      resp = await postRequest(
        ApiEndpoints.CreateTask,
        { ...taskInputPersonal, tenantId: loginData.user.tenants[0] },
        generateAuthorizationHeader(loginData)
      );
      const tenantTask: TaskOutput = resp.body;

      resp = await patchTask(personalTask.id.toString(), { ...personalTask, title: 'asd' }, loginData2);
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe(LocaleEn.forbidden);

      resp = await patchTask(tenantTask.id, { ...tenantTask, title: 'asd' }, loginData2);
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe(LocaleEn.forbidden);
    });

    interface PositiveBehaviorTestData {
      testName: string;
      taskFrom: TaskInput;
      payload: Partial<TaskInput>;
    }
    test.each`
      testName              | taskFrom             | payload
      ${'No change'}        | ${taskInputPersonal} | ${{}}
      ${'Only title'}       | ${taskInputPersonal} | ${{ title: 'New title' }}
      ${'Only desc'}        | ${taskInputPersonal} | ${{ description: 'New description' }}
      ${'Title and desc'}   | ${taskInputPersonal} | ${{ title: 'New title', description: 'New description' }}
      ${'Todo -> progress'} | ${taskInputPersonal} | ${{ status: TaskStatus.InProgress }}
      ${'Full update'}      | ${taskInputPersonal} | ${{ title: 'New title', description: 'New description', status: TaskStatus.InProgress }}
    `('$testName', async ({ payload, taskFrom }: PositiveBehaviorTestData) => {
      const loginData = await getLoggedInUser();
      const creatureRes = await postRequest(ApiEndpoints.CreateTask, taskFrom, generateAuthorizationHeader(loginData));
      const originalTask: TaskOutput = creatureRes.body;
      validatePersonalTask(originalTask, loginData, taskFrom, 1);

      const patchRes = await patchTask(originalTask.id, payload, loginData);
      expect(patchRes.body.message).toBeUndefined();
      expect(patchRes.status).toBe(200);

      const expectedTask = { ...originalTask, ...payload };

      const patchedTask = patchRes.body;
      compareTasks(patchedTask, expectedTask);
      expect(new Date(patchedTask.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalTask.updatedAt).getTime()
      );
    });

    interface NegativeBehaviorTestData {
      title: string;
      from: TaskInput;
      payload: Partial<TaskInput>;
      error: string;
    }

    describe.each<NegativeBehaviorTestData>([
      {
        title: 'Unassigning Personal task',
        from: taskInputPersonal,
        payload: { assigneeId: null }, // NOTE: undefiend field value wont go through http
        error: LocaleEn.cantUnAssignTHePersonalTask,
      },
      {
        title: 'Todo -> Blocked',
        from: taskInputPersonal,
        payload: { status: TaskStatus.Blocked },
        error: LocaleEn.badTaskStatusChange,
      },
      {
        title: 'Todo -> Done',
        from: taskInputPersonal,
        payload: { status: TaskStatus.Done },
        error: LocaleEn.badTaskStatusChange,
      },
    ])('Negative behavior', ({ title, from, payload, error }) => {
      test(`${title}`, async () => {
        const loginData = await getLoggedInUser();
        const creatureRes = await postRequest(ApiEndpoints.CreateTask, from, generateAuthorizationHeader(loginData));
        const originalTask: TaskOutput = creatureRes.body;
        validatePersonalTask(originalTask, loginData, from, 1);

        const patchRes = await patchTask(originalTask.id, payload, loginData);
        expect(patchRes.status).toBe(400);
        expect(patchRes.body.message).toBe(error);
      });
    });

    test('Task status validation', async () => {
      const loginData = await getLoggedInUser();
      let resp = await postRequest(ApiEndpoints.CreateTask, taskInputPersonal, generateAuthorizationHeader(loginData));
      let personalTask: TaskOutput = resp.body;

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.InProgress }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.InProgress);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Todo }, loginData);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe(LocaleEn.badTaskStatusChange);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Blocked }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.Blocked);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.InProgress }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.InProgress);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Blocked }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.Blocked);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Todo }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.Todo);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.InProgress }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.InProgress);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Done }, loginData);
      personalTask = resp.body;
      expect(resp.status).toBe(200);
      expect(personalTask.status).toBe(TaskStatus.Done);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Todo }, loginData);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe(LocaleEn.badTaskStatusChange);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.InProgress }, loginData);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe(LocaleEn.badTaskStatusChange);

      resp = await patchTask(personalTask.id, { ...personalTask, status: TaskStatus.Blocked }, loginData);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe(LocaleEn.badTaskStatusChange);
    });

    test('Change assignee', async () => {
      const loginData = await getLoggedInUser();
      const loginDataSameTenant = await getLoggedInUser({
        username: 'adam.szi2',
        email: 'adam.szi2@snapsoft.hu',
        password: 'Password123!',
      });
      const loginDataOtherTenant = await getLoggedInUser({
        username: 'adam.szi3',
        email: 'adam.szi@snapsoftaaa.hu',
        password: 'Password123!',
      });
      let resp = await postRequest(
        ApiEndpoints.CreateTask,
        { ...taskInputPersonal, tenantId: loginData.user.tenants[0] },
        generateAuthorizationHeader(loginData)
      );
      let tenantTask: TaskOutput = resp.body;

      resp = await patchTask(tenantTask.id, { ...tenantTask, assigneeId: loginData.user.id }, loginData);
      tenantTask = resp.body;
      expect(resp.status).toBe(200);
      expect(tenantTask.assigneeId).toBe(loginData.user.id);

      resp = await patchTask(tenantTask.id, { ...tenantTask, assigneeId: loginDataSameTenant.user.id }, loginData);
      tenantTask = resp.body;
      expect(resp.status).toBe(200);
      expect(tenantTask.assigneeId).toBe(loginDataSameTenant.user.id);

      resp = await patchTask(tenantTask.id, { ...tenantTask, assigneeId: loginDataOtherTenant.user.id }, loginData);
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe(LocaleEn.forbidden);

      resp = await patchTask(tenantTask.id, { ...tenantTask, assigneeId: loginData.user.id }, loginDataOtherTenant);
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe(LocaleEn.forbidden);
    });
  });
});
