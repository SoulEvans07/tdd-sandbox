import request from 'supertest';
import { setupServer } from '../server';
import { UserInput } from '../DAL/models/User';
import { AuthResponse } from '../types/api';

const server = setupServer();

export enum ApiEndpoints {
  CreateUser = '/api/1.0/user',
  GetUsersForTenant = '/api/1.0/users/tenant/:tenantId',
  Login = '/api/1.0/auth/login',
  GetToken = '/api/1.0/auth/token',
  CreateTask = '/api/1.0/task',
  TaskList = '/api/1.0/tasks/:tenantId',
  GetTenantsForUser = '/api/1.0/tenants/user',
  DeleteTasks = '/api/1.0/tasks',
  EditTask = '/api/1.0/task/:id',
}

export const postUser = async (body?: any) => await postRequest(ApiEndpoints.CreateUser, body);

export const postRequest = async (path: string, body?: any, headers?: Record<string, string>) => {
  const req = request(server).post(path);
  if (headers) {
    Object.entries(headers).forEach(entry => {
      req.set(entry[0], entry[1]);
    });
  }
  return req.send(body);
};

export const getUsers = async (tenantId: number, headers?: Record<string, string>) =>
  await getRequest(ApiEndpoints.GetUsersForTenant.replace(':tenantId', tenantId.toString()), headers);

export const getRequest = async (path: string, headers?: Record<string, string>) => {
  const req = request(server).get(path);
  if (headers) {
    Object.entries(headers).forEach(entry => {
      req.set(entry[0], entry[1]);
    });
  }
  return req.send();
};

export const deleteRequest = async (path: string, body?: any, headers?: Record<string, string>) => {
  const req = request(server).delete(path);
  if (headers) {
    Object.entries(headers).forEach(entry => {
      req.set(entry[0], entry[1]);
    });
  }
  return req.send(body);
};

export const patchRequest = async (path: string, body?: any, headers?: Record<string, string>) => {
  const req = request(server).patch(path);
  if (headers) {
    Object.entries(headers).forEach(entry => {
      req.set(entry[0], entry[1]);
    });
  }
  return req.send(body);
};

export const validateTokenResponse = (user: UserInput, response: request.Response) => {
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

export async function loginUser(userInput: UserInput): Promise<AuthResponse> {
  const resp = await postRequest(ApiEndpoints.Login, { username: userInput.username, password: userInput.password });
  return resp.body;
}

export function generateAuthorizationHeader(loginData: AuthResponse): Record<string, string> | undefined {
  return { authorization: 'Bearer ' + loginData.token };
}
