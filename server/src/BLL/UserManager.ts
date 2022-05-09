import bcrypt from 'bcrypt';
import User, { UserInput } from '../DAL/models/User';

export class UserManager {
  static async save(user: UserInput) {
    const hashed = await bcrypt.hash(user.password, 10);

    return User.create({
      username: user.username,
      email: user.email,
      password: hashed,
    });
  }
}
