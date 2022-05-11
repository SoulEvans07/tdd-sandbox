import Task from './Task';
import Tenant from './Tenant';
import User from './User';

Tenant.hasMany(User, {
  foreignKey: 'tenantId',
});
User.belongsTo(Tenant);

Tenant.hasMany(Task, {
  foreignKey: 'tenantId',
});
Task.belongsTo(Tenant);

User.hasMany(Task, {
  foreignKey: 'assigneeId',
});
Task.belongsTo(User);

Task.hasMany(Task, {
  foreignKey: 'parentId',
});
Task.belongsTo(Task);
