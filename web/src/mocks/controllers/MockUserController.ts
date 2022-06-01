import { rest } from 'msw';
import { serverUrl } from '../../config';
import { MockController } from './types';
import {
  GetWorkspacesResponseDTO,
  RestrictedUserDTO,
  SignupDTO,
  userController,
} from '../../controllers/UserController';
import { mockTenantsTable } from './mockData';

export const mockUserController: MockController<typeof userController> = {
  register: rest.post<SignupDTO, {}, {}>(serverUrl + '/api/1.0/user', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  getWorkspaces: rest.get<{}, {}, GetWorkspacesResponseDTO[]>(serverUrl + '/api/1.0/tenants/user', (req, res, ctx) => {
    return res(ctx.json(mockTenantsTable));
  }),
  list: rest.get<{}, { tenantId: string }, RestrictedUserDTO[]>(
    serverUrl + '/api/1.0/users/tenant/:tenantId',
    (req, res, ctx) => {
      return res(ctx.json([]));
    }
  ),
};
