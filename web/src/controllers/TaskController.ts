import { ControllerBase } from './types';

class TaskController extends ControllerBase {
  protected version = '1.0';
  protected name = 'tasks';

  create(task: CreateTaskDTO, token: string) {
    return this.post<CreateTaskResponseDTO>(this.apiUrl + '/task', task, this.toAuthHeader(token));
  }

  list(token: string, tenantId?: number) {
    const tenant = tenantId ? '/' + tenantId : '';
    return this.get<CreateTaskResponseDTO[]>(this.entityUrl + tenant, undefined, this.toAuthHeader(token));
  }
}

export const taskController = new TaskController();

type TaskStatus = 'Todo' | 'InProgress' | 'Blocked' | 'Done';

export interface CreateTaskDTO {
  title: string;
}

export interface CreateTaskResponseDTO {
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
