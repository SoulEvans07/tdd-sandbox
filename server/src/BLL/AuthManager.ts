import User from '../DAL/models/User';

import { BadPasswordException } from '../types/exceptions/BadPasswordException';
import { UserNotFoundException } from '../types/exceptions/UserNotFoundException';
import SecurityHelper from '../utils/SecurityHelper';

export default class AuthManager {
  public static async login(username: string, password: string) {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UserNotFoundException(403);
    }

    if (!(await SecurityHelper.comparePasswords(password, user.password))) {
      throw new BadPasswordException();
    }

    return AuthManager.generateLoginResponse(user);
  }

  public static async generateTokenForUser(username: string) {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UserNotFoundException(403);
    }

    return AuthManager.generateLoginResponse(user);
  }

  private static generateLoginResponse(user: User) {
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tenants: [user.tenantId],
      },
      token: SecurityHelper.generateJwtToken(user),
    };
  }
}
