import _ from 'lodash';
import { rest } from 'msw';
import { serverUrl } from '../config';

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export const mockNewUser: RegisterBody = {
  username: 'adam.szi',
  email: 'adam.szi@snapsoft.hu',
  password: '123456',
};

export const mockRegisterResponse: RegisterResponse = {
  message: 'User created!',
};

export const postRegister = rest.post<RegisterBody, {}, RegisterResponse>(
  serverUrl + '/api/1.0/users',
  (req, res, ctx) => {
    const isValid = _.isEqual(req.body, mockNewUser);

    if (!isValid) return res(ctx.status(400));

    return res(ctx.json(mockRegisterResponse));
  }
);
