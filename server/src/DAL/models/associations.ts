import Tenant from './Tenant';
import User from './User';

Tenant.hasOne(User, {
  foreignKey: 'tenantId',
});
User.belongsTo(Tenant);
