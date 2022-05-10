import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { UserOutput } from '../DAL/models/User';

export default class SecurityHelper {
  public static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public static async comparePasswords(password: string, passwordHashed: string) {
    return await bcrypt.compare(password, passwordHashed);
  }

  public static generateJwtToken(user: UserOutput) {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, config.security.tokenKey, {
      expiresIn: config.security.expiresIn,
      issuer: config.security.issuer,
    });
  }
}
