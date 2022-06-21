import { rest } from 'msw';
import { LoginDTO, LoginResponseDTO, RefreshTokenResponseDTO } from '@tdd-sandbox/api-managers';
import { serverUrl } from '../../config';
import { ErrorResponse, MockApiManager } from './types';
import { MockUserData, mockUsers } from './mockData';
import { AuthError, authorize } from './helpers';
import { authManager } from '../../services/api';

function tokenResponseFrom(user: MockUserData, token?: string) {
  return {
    user: {
      id: user.data.id,
      username: user.data.username,
      email: user.data.email,
      tenants: user.data.tenants,
    },
    token: token || user.token,
  };
}

export const mockAuthManager: MockApiManager<typeof authManager> = {
  login: rest.post<LoginDTO, {}, LoginResponseDTO | ErrorResponse>(
    serverUrl + '/api/1.0/auth/login',
    (req, res, ctx) => {
      const user = mockUsers.find(u => u.data.username === req.body.username);
      if (!user) return res(ctx.status(403), ctx.json({ message: 'User not found' }));
      if (user.password !== req.body.password) return res(ctx.status(403), ctx.json({ message: 'Bad password' }));

      return res(ctx.json(tokenResponseFrom(user)));
    }
  ),
  refreshToken: rest.post<{}, {}, RefreshTokenResponseDTO | ErrorResponse>(
    serverUrl + '/api/1.0/auth/token',
    (req, res, ctx) => {
      try {
        const user = authorize(req);
        return res(ctx.json(tokenResponseFrom(user, user.refreshedToken)));
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
};
