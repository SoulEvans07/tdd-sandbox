import request from 'supertest';
import { app } from '../app';

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
