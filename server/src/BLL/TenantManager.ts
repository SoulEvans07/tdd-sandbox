import Tenant, { TenantOutput } from '../DAL/models/Tenant';
import User, { UserOutput } from '../DAL/models/User';

export class TenantManager {
  public static async getTenantsForUser(user: UserOutput): Promise<TenantOutput[]> {
    const tenant = await Tenant.findOne({
      where: {
        id: user.tenantId,
      },
    });
    return tenant ? [tenant] : [];
  }

  public static async getUsersByTenant(tenantId: number): Promise<UserOutput[]> {
    return await User.findAll({ where: { tenantId } });
  }
}
