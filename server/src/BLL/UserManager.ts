import bcrypt from 'bcrypt';
import User, { UserInput } from '../DAL/models/User';

export class UserManager {
  public static async save(user: UserInput) {
    const hashed = await bcrypt.hash(user.password, 10);

    return User.create({
      username: user.username,
      email: user.email,
      password: hashed,
    });
  }

  public static async isExistsByEmail(email: string): Promise<boolean> {
    return !!(await User.findOne({ where: { email } }));
  }

  public static async isExistsByUsername(username: string): Promise<boolean> {
    return !!(await User.findOne({ where: { username } }));
  }
}
