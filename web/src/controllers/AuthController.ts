import { ControllerBase } from './types';

class AuthController extends ControllerBase {
  protected version = '1.0';
  protected name = 'auth';

  login(user: LoginDTO) {
    return this.post<LoginResponseDTO>(this.entityUrl + '/login', user);
  }

  refreshToken(token: string) {
    return this.post<RefreshTokenResponseDTO>(this.entityUrl + '/token', {}, this.toAuthHeader(token));
  }
}

export const authController = new AuthController();

export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    id: number;
    username: string;
    email: string;
    tenants: number[];
  };
  token: string;
}

export interface LoginErrorDTO {}

export interface RefreshTokenResponseDTO extends LoginResponseDTO {}

export interface RefreshTokenErrorDTO {}
