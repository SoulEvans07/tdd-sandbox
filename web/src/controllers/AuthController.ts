import { request } from '../services/request/request';
import { ControllerBase } from './types';

class AuthController extends ControllerBase {
  protected version = '1.0';
  protected name = 'auth';

  login(user: LoginDTO) {
    return request.post<LoginResponseDTO>(this.baseUrl + '/login', user);
  }

  refreshToken(token: string) {
    return request.post<RefreshTokenResponseDTO>(this.baseUrl + '/token', {}, { authorization: `Bearer ${token}` });
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
  };
  token: string;
}

export interface LoginErrorDTO {}

export interface RefreshTokenResponseDTO {
  token: string;
}

export interface RefreshTokenErrorDTO {}
