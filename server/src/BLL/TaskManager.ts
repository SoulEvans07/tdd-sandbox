import Task, { TaskInput, TaskOutput, TaskStatus } from '../DAL/models/Task';
import { UserOutput } from '../DAL/models/User';

export class TaskManager {
  public static async createTask(task: TaskInput, user: UserOutput): Promise<TaskOutput> {
    const isPersonal = !task.tenantId;
    const order = (await Task.count({ where: isPersonal ? { assigneeId: user.id } : { tenantId: task.tenantId } })) + 1;
    const taskForSave: TaskInput = {
      title: task.title,
      description: task.description,
      tenantId: task.tenantId,
      status: TaskStatus.Todo,
      assigneeId: isPersonal ? user.id : undefined,
      parentId: undefined,
      order,
    };

    return await Task.create(taskForSave);
  }
}
