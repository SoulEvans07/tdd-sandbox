import request from 'supertest';
import { app } from '../app';
import { UserInput } from '../DAL/models/User';

export const postUser = async (body?: any) => await postRequest('/api/1.0/users', body);

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
