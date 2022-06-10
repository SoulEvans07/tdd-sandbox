import { Model, DataTypes, Optional } from 'sequelize';
import { EntityTimestamps, Identifiable } from 'tdd-sandbox-shared';
import sequelize from '../database';

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Blocked = 'Blocked',
  Done = 'Done',
}

interface TaskAttributes extends Identifiable, EntityTimestamps {
  title: string;
  description: string;
  order: number;
  status: TaskStatus;
  tenantId?: number | null;
  parentId?: number | null;
  assigneeId?: number | null;
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
  public tenantId!: number | null;
  public parentId!: number | null;
  public assigneeId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
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
      defaultValue: null,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    sequelize,
    paranoid: true,
  }
);

export default Task;
