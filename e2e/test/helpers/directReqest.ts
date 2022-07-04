type Chainable<T> = Cypress.Chainable<T>;
type Response<T> = Cypress.Response<T>;

export class DirectRequest {
  public static login(username: string, password: string): Chainable<Response<LoginResponseDTO>> {
    return cy.request({ method: 'POST', url: 'localhost:3001/api/1.0/auth/login', body: { username, password } });
  }

  public static createTask(token: string, task: CreateTaskDTO): Chainable<Response<TaskResponseDTO>> {
    return cy.request({
      method: 'POST',
      url: 'localhost:3001/api/1.0/task',
      body: task,
      headers: this.toAuthHeader(token),
    });
  }

  public static getTasks(token: string, tenantId?: number): Chainable<Response<TaskResponseDTO[]>> {
    const tenant = tenantId ? '/' + tenantId : '';
    return cy.request({
      method: 'GET',
      url: 'localhost:3001/api/1.0/tasks' + tenant,
      headers: this.toAuthHeader(token),
    });
  }

  private static toAuthHeader(token: string): Record<string, string> {
    return { authorization: `Bearer ${token}` };
  }
}

export interface Identifiable {
  id: number;
}

export interface EntityTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface LoginResponseDTO {
  user: {
    id: number;
    username: string;
    email: string;
    tenants: number[];
  };
  token: string;
}

interface CreateTaskDTO {
  title: string;
  tenantId?: number;
}

type TaskStatus = 'Todo' | 'InProgress' | 'Blocked' | 'Done';
interface TaskAttributes extends Identifiable {
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: number;
  tenantId?: number;
  order: number;
  parentId?: number;
}

type TaskResponseDTO = TaskAttributes & EntityTimestamps;
