import { rest } from 'msw';
import _ from 'lodash';
import { serverUrl } from '../../config';
import { MockController } from './types';
import { GetWorkspacesResponseDTO, SignupDTO, userController } from '../../controllers/UserController';
import { mockPassword, mockTenant, mockUser } from './mockData';

export const mockUserController: MockController<typeof userController> = {
  register: rest.post<SignupDTO, {}, {}>(serverUrl + '/api/1.0/user', (req, res, ctx) => {
    const isValid = _.isEqual(req.body, mockNewUser);
    if (!isValid) return res(ctx.status(400));
    return res(ctx.status(200));
  }),
  getWorkspaces: rest.get<{}, {}, GetWorkspacesResponseDTO[]>(serverUrl + '/api/1.0/tenants/user', (req, res, ctx) => {
    return res(ctx.json([mockWorkspace]));
  }),
};

export const mockNewUser: SignupDTO = {
  username: mockUser.username,
  email: mockUser.email,
  password: mockPassword,
};

export const mockWorkspace: GetWorkspacesResponseDTO = {
  id: mockTenant.id,
  name: mockTenant.name,
};
