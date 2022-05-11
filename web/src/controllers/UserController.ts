import { ControllerBase } from './types';

class UserController extends ControllerBase {
  protected version = '1.0';
  protected name = 'users';

  register(data: SignupDTO) {
    return this.post<{}>(this.baseUrl, data);
  }
}

export const userController = new UserController();

export interface SignupDTO {
  username: string;
  email: string;
  password: string;
}

export interface SignupErrorDTO {}
