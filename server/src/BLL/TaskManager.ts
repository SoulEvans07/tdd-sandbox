import Task, { TaskInput, TaskOutput, TaskStatus } from '../DAL/models/Task';
import Tenant from '../DAL/models/Tenant';
import User, { UserOutput } from '../DAL/models/User';
import { BadRequestException } from '../types/exceptions/BadRequestException';
import { ForbiddenException } from '../types/exceptions/ForbiddenException';
import { TaskNotFoundException } from '../types/exceptions/TaskNotFoundException';
import { R } from '../types/localization';

export class TaskManager {
  public static async createTask(task: TaskInput, user: UserOutput): Promise<TaskOutput> {
    const isPersonal = !task.tenantId;
    const order = (await Task.count({ where: isPersonal ? { assigneeId: user.id } : { tenantId: task.tenantId } })) + 1;
    const taskForSave: TaskInput = {
      title: task.title,
      description: task.description,
      tenantId: task.tenantId ? task.tenantId : null,
      status: TaskStatus.Todo,
      assigneeId: isPersonal ? user.id : null,
      parentId: null,
      order,
      deletedAt: null,
    };

    return await Task.create(taskForSave);
  }

  public static async listTasks(user: UserOutput, tenantId?: number) {
    const personalQuery = {
      assigneeId: user.id,
    };

    const tenantQuery = {
      tenantId,
    };

    return await Task.findAll({ where: tenantId ? tenantQuery : personalQuery });
  }

  public static async removeTasks(taskIds: number[], user: UserOutput) {
    const tasksForDelete = await Task.findAll({
      where: {
        id: taskIds,
      },
    });

    tasksForDelete.forEach(task => {
      if ((task.assigneeId !== user.id && !task.tenantId) || (task.tenantId && task.tenantId !== user.tenantId)) {
        throw new ForbiddenException();
      }
    });

    await Task.destroy({ where: { id: taskIds } });
  }

  public static async updateTask(taskId: number, patch: Partial<TaskInput>, user: UserOutput) {
    const oldTask = await Task.findOne({
      where: { id: taskId },
    });

    if (!oldTask) {
      throw new TaskNotFoundException();
    }

    if (oldTask.assigneeId && !oldTask.tenantId && user.id !== oldTask.assigneeId) {
      throw new ForbiddenException();
    }

    if (oldTask.tenantId && user.tenantId !== oldTask.tenantId) {
      throw new ForbiddenException();
    }

    if (patch.hasOwnProperty('assigneeId')) {
      if (patch.assigneeId) {
        const targetUser = await User.findOne({ where: { id: patch.assigneeId } });
        if (oldTask.tenantId && ((targetUser && targetUser.tenantId !== oldTask.tenantId) || !targetUser)) {
          throw new ForbiddenException();
        }
      }

      if (oldTask.assigneeId && !oldTask.tenantId && patch.assigneeId == null) {
        throw new BadRequestException(R.cantUnAssignTHePersonalTask);
      }
    }

    if (patch.hasOwnProperty('status') && oldTask.status !== patch.status) {
      if (oldTask.status === TaskStatus.Todo && patch.status !== TaskStatus.InProgress) {
        throw new BadRequestException(R.badTaskStatusChange);
      }

      if (oldTask.status === TaskStatus.InProgress && patch.status === TaskStatus.Todo) {
        throw new BadRequestException(R.badTaskStatusChange);
      }

      if (oldTask.status === TaskStatus.Blocked && patch.status === TaskStatus.Done) {
        throw new BadRequestException(R.badTaskStatusChange);
      }

      if (oldTask.status === TaskStatus.Done && patch.status !== TaskStatus.Done) {
        throw new BadRequestException(R.badTaskStatusChange);
      }
    }

    const merged = { ...oldTask, ...patch };

    await Task.update(
      {
        title: merged.title,
        description: merged.description,
        status: merged.status,
        assigneeId: merged.assigneeId,
      },
      { where: { id: taskId } }
    );

    return await Task.findOne({ where: { id: taskId } });
  }
}
