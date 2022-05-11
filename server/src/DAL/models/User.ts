import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  tenantId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id' | 'tenantId'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public tenantId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize,
    paranoid: true,
  }
);

export default User;
