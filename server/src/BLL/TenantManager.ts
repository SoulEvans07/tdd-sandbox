import Tenant, { TenantOutput } from '../DAL/models/Tenant';
import { UserOutput } from '../DAL/models/User';

export class TenantManager {
  public static async getTenantsForUser(user: UserOutput): Promise<TenantOutput[]> {
    const tenant = await Tenant.findOne({
      where: {
        id: user.tenantId,
      },
    });
    return tenant ? [tenant] : [];
  }
}
