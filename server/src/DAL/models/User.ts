import { Model, DataTypes, Optional } from 'sequelize';
import { EntityTimestamps, Identifiable } from 'shared-types';
import sequelize from '../database';
import Task from './Task';

interface UserAttributes extends Identifiable, EntityTimestamps {
  username: string;
  email: string;
  password: string;
  tenantId: number;
}

export interface UserInput extends Optional<UserAttributes, 'id' | 'tenantId'> {}
export interface UserOutput extends Required<UserAttributes> {}
export type RestrictedUserOutput = Omit<UserAttributes, 'password' | 'tenantId' | keyof EntityTimestamps>;

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

User.hasMany(Task, {
  sourceKey: 'id',
  foreignKey: 'assigneeId',
  as: 'tasks',
});

Task.belongsTo(User, {
  foreignKey: 'assigneeId',
  as: 'assignee',
});

Task.hasMany(Task, {
  sourceKey: 'id',
  foreignKey: 'parentId',
  as: 'subtasks',
});

Task.belongsTo(Task, {
  foreignKey: 'parentId',
  as: 'parent',
});

export default User;
