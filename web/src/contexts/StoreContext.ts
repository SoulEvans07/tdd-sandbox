export type TaskStatus = 'todo' | 'inProgress' | 'blocked' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}
