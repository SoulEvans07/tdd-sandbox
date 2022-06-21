import { RestRequest } from 'msw';
import { HttpStatusCode } from 'tdd-sandbox-shared';
import { MockUserData, mockUsers } from './mockData';

export class AuthError extends Error {
  name = 'AuthError';

  constructor(public status: HttpStatusCode, public message: string) {
    super(message);
  }
}

export function authorize(req: RestRequest): MockUserData {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) throw new AuthError(403, 'Missing Authorization header');

  const authToken = authHeader.replace('Bearer ', '');
  const user = mockUsers.find(u => u.token === authToken || u.refreshedToken === authToken);
  if (!user) throw new AuthError(401, 'Unauthorized');

  return user;
}
