import { Model, DataTypes, Optional } from 'sequelize';
import { EntityTimestamps, Identifiable } from 'shared-types';
import sequelize from '../database';
import Task from './Task';
import User from './User';

interface TenantAttributes extends Identifiable, EntityTimestamps {
  name: string;
}

export interface TenantInput extends Optional<TenantAttributes, 'id'> {}
export interface TenantOutput extends Required<TenantAttributes> {}

class Tenant extends Model<TenantAttributes, TenantInput> implements TenantAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Tenant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    sequelize,
    paranoid: true,
  }
);

Tenant.hasMany(User, {
  sourceKey: 'id',
  foreignKey: 'tenantId',
  as: 'users',
});

User.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant',
});

Tenant.hasMany(Task, {
  sourceKey: 'id',
  foreignKey: 'tenantId',
  as: 'tasks',
});

Task.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant',
});

export default Tenant;
