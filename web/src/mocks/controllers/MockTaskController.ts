import { rest } from 'msw';
import { serverUrl } from '../../config';
import { MockController } from './types';
import { CreateTaskDTO, CreateTaskResponseDTO, taskController } from '../../controllers/TaskController';

export const mockTaskController: MockController<typeof taskController> = {
  create: rest.post<CreateTaskDTO, {}, CreateTaskResponseDTO>(serverUrl + '/api/1.0/task', (req, res, ctx) => {
    return res(ctx.json(mockNewTask));
  }),
  list: rest.get<{}, {}, CreateTaskResponseDTO[]>(serverUrl + '/api/1.0/tasks', (req, res, ctx) => {
    return res(ctx.json([mockNewTask]));
  }),
};

export const mockNewTask: CreateTaskResponseDTO = {
  id: 0,
  title: 'Mock New Task',
  status: 'Todo',
  description: '',
  order: 0,
};
