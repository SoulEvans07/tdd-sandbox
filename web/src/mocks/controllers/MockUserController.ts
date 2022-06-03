import { rest } from 'msw';
import { serverUrl } from '../../config';
import { ErrorResponse, MockController } from './types';
import {
  GetWorkspacesResponseDTO,
  RestrictedUserDTO,
  SignupDTO,
  userController,
} from '../../controllers/UserController';
import { AuthError, authorize } from './helpers';
import { mockUsers } from './mockData';

export const mockUserController: MockController<typeof userController> = {
  register: rest.post<SignupDTO, {}, {}>(serverUrl + '/api/1.0/user', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  getWorkspaces: rest.get<{}, {}, GetWorkspacesResponseDTO[] | ErrorResponse>(
    serverUrl + '/api/1.0/tenants/user',
    (req, res, ctx) => {
      try {
        const user = authorize(req);
        return res(ctx.json(user.tenants));
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
  list: rest.get<{}, { tenantId: string }, RestrictedUserDTO[] | ErrorResponse>(
    serverUrl + '/api/1.0/users/tenant/:tenantId',
    (req, res, ctx) => {
      try {
        const user = authorize(req);
        const tenantId = Number(req.params.tenantId);
        if (!user.data.tenants.includes(tenantId)) return res(ctx.status(403), ctx.json({ message: 'Forbidden' }));

        const users = mockUsers
          .filter(u => u.data.tenants.includes(tenantId))
          .map((u): RestrictedUserDTO => ({ id: u.data.id, username: u.data.username, email: u.data.email }));
        return res(ctx.json(users));
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
};
