import request from 'supertest';
import { app } from '../app';
import { UserInput } from '../DAL/models/User';

export enum ApiEndpoints {
  CreateUser = '/api/1.0/users',
  Login = '/api/1.0/auth/login',
  GetToken = '/api/1.0/auth/token',
  CreateTask = '/api/1.0/tasks',
  TaskList = '/api/1.0/tasks/:tenantId',
  GetTenantsForUser = '/api/1.0/tenants/user',
}

export const postUser = async (body?: any) => await postRequest(ApiEndpoints.CreateUser, body);

export const postRequest = async (path: string, body?: any, headers?: Record<string, string>) => {
  const req = request(app).post(path);
  if (headers) {
    Object.entries(headers).forEach(entry => {
      req.set(entry[0], entry[1]);
    });
  }
  return req.send(body);
};

export const getRequest = async (path: string, headers?: Record<string, string>) => {
  const req = request(app).get(path);
  if (headers) {
    Object.entries(headers).forEach(entry => {
      req.set(entry[0], entry[1]);
    });
  }
  return req.send();
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
