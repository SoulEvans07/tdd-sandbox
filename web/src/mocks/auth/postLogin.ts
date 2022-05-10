import _ from 'lodash';
import { rest } from 'msw';
import { serverUrl } from '../../config';

export interface LoginBody {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    _id: number;
    username: string;
    email: string;
  };
  token: string;
}

export const mockExistingUser: LoginBody = {
  username: 'adam.szi',
  password: '123456',
};

export const mockLoginResponse: LoginResponse = {
  user: {
    _id: 0,
    username: 'adam.szi',
    email: 'adam.szi@snapsoft.hu',
  },
  token: 'randomJwtToken',
};

export const postLogin = rest.post<LoginBody, {}, LoginResponse>(serverUrl + '/api/1.0/auth/login', (req, res, ctx) => {
  const isValid = _.isEqual(req.body, mockExistingUser);

  if (!isValid) return res(ctx.status(400));

  return res(ctx.json(mockLoginResponse));
});
