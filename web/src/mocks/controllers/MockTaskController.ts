import { rest } from 'msw';
import { serverUrl } from '../../config';
import { MockController } from './types';
import { CreateTaskDTO, TaskResponseDTO, taskController } from '../../controllers/TaskController';

export const mockTaskController: MockController<typeof taskController> = {
  create: rest.post<CreateTaskDTO, {}, TaskResponseDTO>(serverUrl + '/api/1.0/task', (req, res, ctx) => {
    return res(ctx.json(mockNewTask));
  }),
  list: rest.get<{}, {}, TaskResponseDTO[]>(serverUrl + '/api/1.0/tasks', (req, res, ctx) => {
    return res(ctx.json([mockNewTask]));
  }),
  remove: rest.delete<{}, {}, TaskResponseDTO[]>(serverUrl + '/api/1.0/tasks', (req, res, ctx) => {
    return res(ctx.json([mockNewTask]));
  }),
  update: rest.patch<{}, { taskId: string }, TaskResponseDTO>(serverUrl + '/api/1.0/task/:taskId', (req, res, ctx) => {
    return res(ctx.json({ ...mockNewTask, ...req.body }));
  }),
};

export const mockNewTask: TaskResponseDTO = {
  id: 0,
  title: 'Mock New Task',
  status: 'Todo',
  description: '',
  order: 0,
};
