import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Blocked = 'Blocked',
  Done = 'Done',
}

interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  order: number;
  status: TaskStatus;
  tenantId?: number;
  parentId?: number;
  assigneeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface TaskInput
  extends Optional<
    TaskAttributes,
    'id' | 'tenantId' | 'parentId' | 'assigneeId' | 'description' | 'order' | 'status'
  > {}
export interface TaskOutput extends Required<TaskAttributes> {}

class Task extends Model<TaskAttributes, TaskInput> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public order!: number;
  public status!: TaskStatus;
  public tenantId!: number;
  public parentId!: number;
  public assigneeId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(TaskStatus).map(o => o)),
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assigneeId: {
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

export default Task;
