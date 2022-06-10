import { Identifiable, EntityTimestamps } from 'tdd-sandbox-shared';
import { ControllerBase } from './types';

class TaskController extends ControllerBase {
  protected version = '1.0';
  protected name = 'tasks';

  create(task: CreateTaskDTO, token: string) {
    return this.post<TaskResponseDTO>(this.apiUrl + '/task', task, this.toAuthHeader(token));
  }

  remove(taskIds: number[], token: string) {
    return this.delete(this.entityUrl, taskIds, this.toAuthHeader(token));
  }

  list(token: string, tenantId?: number) {
    const tenant = tenantId ? '/' + tenantId : '';
    return this.get<TaskResponseDTO[]>(this.entityUrl + tenant, undefined, this.toAuthHeader(token));
  }

  update(taskId: number, patch: Partial<TaskAttributes>, token: string) {
    return this.patch<TaskResponseDTO>(this.apiUrl + '/task/' + taskId, patch, this.toAuthHeader(token));
  }
}

export const taskController = new TaskController();

type TaskStatus = 'Todo' | 'InProgress' | 'Blocked' | 'Done';

export interface TaskAttributes extends Identifiable {
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: number;
  tenantId?: number;
  order: number;
  parentId?: number;
}

export interface CreateTaskDTO {
  title: string;
  tenantId?: number;
}

export type TaskResponseDTO = TaskAttributes & EntityTimestamps;
