import { ApiManager } from './types';

export class UserManager extends ApiManager {
  protected version = '1.0';
  protected name = 'user';

  register(data: SignupDTO) {
    return this.post<{}>(this.entityUrl, data);
  }

  getWorkspaces(token: string) {
    return this.get<GetWorkspacesResponseDTO[]>(this.apiUrl + '/tenants/user', {}, this.toAuthHeader(token));
  }

  list(tenantId: number, token: string) {
    return this.get<RestrictedUserDTO[]>(
      this.apiUrl + '/users/tenant/' + tenantId,
      undefined,
      this.toAuthHeader(token)
    );
  }
}

export interface SignupDTO {
  username: string;
  email: string;
  password: string;
}

export interface SignupErrorDTO {}

export interface GetWorkspacesResponseDTO {
  id: number;
  name: string;
}

export interface RestrictedUserDTO {
  id: number;
  username: string;
  email: string;
}
