import { rest } from 'msw';
import _ from 'lodash';
import { serverUrl } from '../../config';
import { MockController } from './types';
import { authController, LoginDTO, LoginResponseDTO, RefreshTokenResponseDTO } from '../../controllers/AuthController';

export const mockAuthController: MockController<typeof authController> = {
  login: rest.post<LoginDTO, {}, LoginResponseDTO>(serverUrl + '/api/1.0/auth/login', (req, res, ctx) => {
    const isValid = _.isEqual(req.body, mockExistingUser);
    if (!isValid) return res(ctx.status(400));
    return res(ctx.json(mockLoginResponse));
  }),
  refreshToken: rest.post<{}, {}, RefreshTokenResponseDTO>(serverUrl + '/api/1.0/auth/token', (req, res, ctx) => {
    const isValid = req.headers.get('authorization') === `Bearer ${mockLoginResponse.token}`;
    if (!isValid) return res(ctx.status(400));
    return res(ctx.json(mockRefreshTokenResponse));
  }),
};

const user = {
  id: 0,
  username: 'adam.szi',
  email: 'adam.szi@snapsoft.hu',
};

export const mockExistingUser: LoginDTO = {
  username: user.username,
  password: '123456',
};

export const mockLoginResponse: LoginResponseDTO = {
  user,
  token: 'randomJwtToken',
};

export const mockRefreshTokenResponse: RefreshTokenResponseDTO = {
  user,
  token: 'newRandomJwtToken',
};
