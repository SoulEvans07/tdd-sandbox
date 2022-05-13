import { rest } from 'msw';
import _ from 'lodash';
import { serverUrl } from '../../config';
import { MockController } from './types';
import { SignupDTO, userController } from '../../controllers/UserController';

export const mockUserController: MockController<typeof userController> = {
  register: rest.post<SignupDTO, {}, {}>(serverUrl + '/api/1.0/user', (req, res, ctx) => {
    const isValid = _.isEqual(req.body, mockNewUser);
    if (!isValid) return res(ctx.status(400));
    return res(ctx.status(200));
  }),
};

export const mockNewUser: SignupDTO = {
  username: 'adam.szi',
  email: 'adam.szi@snapsoft.hu',
  password: '123456',
};
