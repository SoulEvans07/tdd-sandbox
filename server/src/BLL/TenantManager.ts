import Tenant, { TenantOutput } from '../DAL/models/Tenant';
import User, { UserInput, UserOutput } from '../DAL/models/User';
import SecurityHelper from '../utils/SecurityHelper';

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
