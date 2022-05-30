import { rest, RestHandler } from 'msw';
import { serverUrl } from '../../config';
import { ErrorResponse, MockController } from './types';
import { CreateTaskDTO, TaskResponseDTO, taskController, TaskAttributes } from '../../controllers/TaskController';
import { AuthError, authorize } from './helpers';

let lastId = 1000;

interface MockTaskController extends MockController<typeof taskController> {
  listTenant: RestHandler;
}

export const mockTaskController: MockTaskController = {
  create: rest.post<CreateTaskDTO, {}, TaskResponseDTO | ErrorResponse>(
    serverUrl + '/api/1.0/task',
    (req, res, ctx) => {
      try {
        const user = authorize(req);
        const tenantId = req.body.tenantId;
        return res(
          ctx.json({
            id: lastId++,
            assigneeId: tenantId === undefined ? user.data.id : undefined,
            tenantId: tenantId,
            title: req.body.title,
            description: '',
            status: 'Todo',
            order: 0,
          })
        );
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
  list: rest.get<{}, { tenantId: string }, TaskResponseDTO[] | ErrorResponse>(
    serverUrl + '/api/1.0/tasks',
    (req, res, ctx) => {
      try {
        const user = authorize(req);
        return res(ctx.json(user.tasks));
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
  listTenant: rest.get<{}, { tenantId: string }, TaskResponseDTO[] | ErrorResponse>(
    serverUrl + '/api/1.0/tasks/:tenantId',
    (req, res, ctx) => {
      try {
        const user = authorize(req);

        const tenantId = Number(req.params.tenantId);
        const tenant = user.tenants.find(t => t.id === tenantId);

        if (!tenant) return res(ctx.status(403), ctx.json({ message: 'Forbidden' }));
        return res(ctx.json(tenant.tasks));
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
  remove: rest.delete<number[], {}, {} | ErrorResponse>(serverUrl + '/api/1.0/tasks', (req, res, ctx) => {
    try {
      const user = authorize(req);
      const tasks = user.tasks.filter(t => req.body.includes(t.id));
      const allFound = tasks.length === req.body.length;

      if (!allFound) return res(ctx.status(403), ctx.json({ message: 'Forbidden' }));
      return res(ctx.status(200));
    } catch (err) {
      const { status, message } = err as AuthError;
      return res(ctx.status(status), ctx.json({ message }));
    }
  }),
  update: rest.patch<Partial<TaskAttributes>, { taskId: string }, TaskResponseDTO | ErrorResponse>(
    serverUrl + '/api/1.0/task/:taskId',
    (req, res, ctx) => {
      try {
        const user = authorize(req);
        const taskId = Number(req.params.taskId);

        const task = user.tasks.find(t => t.id === taskId);
        if (!task) return res(ctx.status(404), ctx.json({ message: 'Task not found' }));
        if (req.body.id && task.id !== req.body.id) return res(ctx.status(400), ctx.json({ message: 'ID mismatch' }));

        return res(ctx.json({ ...task, ...req.body }));
      } catch (err) {
        const { status, message } = err as AuthError;
        return res(ctx.status(status), ctx.json({ message }));
      }
    }
  ),
};
