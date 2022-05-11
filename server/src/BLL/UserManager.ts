import Tenant from '../DAL/models/Tenant';
import User, { UserInput } from '../DAL/models/User';
import SecurityHelper from '../utils/SecurityHelper';

export class UserManager {
  public static async save(user: UserInput) {
    const emailPostFix = user.email.split('@')[1];
    let tenantForUser = await Tenant.findOne({ where: { name: emailPostFix } });
    if (!tenantForUser) {
      tenantForUser = await Tenant.create({
        name: emailPostFix,
      });
    }

    return User.create({
      username: user.username,
      email: user.email,
      password: await SecurityHelper.hashPassword(user.password),
      tenantId: tenantForUser.id,
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
