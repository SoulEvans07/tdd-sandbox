import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface TenantAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
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

export default Tenant;
