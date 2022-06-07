type Response<T> = Cypress.Response<T>;

export class DirectRequest {
  public static async login(username: string, password: string): Promise<Response<LoginResponseDTO>> {
    return new Promise(resolve => {
      cy.request({ method: 'POST', url: 'localhost:3001/api/1.0/auth/login', body: { username, password } }).then(
        response => {
          cy.log('login response', response);
          resolve(response);
        }
      );
    });
  }

  public static async createTask(token: string, task: CreateTaskDTO): Promise<Response<TaskResponseDTO>> {
    return new Promise(resolve => {
      cy.request({
        method: 'POST',
        url: 'localhost:3001/api/1.0/task',
        body: task,
        headers: this.toAuthHeader(token),
      }).then(response => {
        cy.log('login response', response);
        resolve(response);
      });
    });
  }

  public static async getTasks(token: string, tenantId?: number): Promise<Response<TaskResponseDTO[]>> {
    const tenant = tenantId ? '/' + tenantId : '';
    return new Promise(resolve => {
      cy.request({
        method: 'GET',
        url: 'localhost:3001/api/1.0/tasks' + tenant,
        headers: this.toAuthHeader(token),
      }).then(response => {
        cy.log(`tasks${tenant} response`, response);
        resolve(response);
      });
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
