import User, { UserInput } from '../DAL/models/User';
import SecurityHelper from '../utils/SecurityHelper';

export class UserManager {
  public static async save(user: UserInput) {
    return User.create({
      username: user.username,
      email: user.email,
      password: await SecurityHelper.hashPassword(user.password),
    });
  }

  public static async getUserByName(username: string) {
    return await User.findOne({ where: { username } });
  }

  public static async isExistsByEmail(email: string): Promise<boolean> {
    return !!(await User.findOne({ where: { email } }));
  }

  public static async isExistsByUsername(username: string): Promise<boolean> {
    return !!(await User.findOne({ where: { username } }));
  }
}
