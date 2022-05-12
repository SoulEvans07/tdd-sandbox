import { NextFunction, Response } from 'express';
import { check } from 'express-validator';
import { userInfo } from 'os';
import { TaskManager } from '../BLL/TaskManager';
import { TaskInput } from '../DAL/models/Task';
import { epMeta } from '../decorators/api.decorators';
import { AuthorizedRequest, ControllerBase, ValidatedAuthorizedRequest } from '../types/api';
import { BadRequestException } from '../types/exceptions/BadRequestException';
import { ForbiddenException } from '../types/exceptions/ForbiddenException';
import { R } from '../types/localization';

interface A {
  tenantId?: string;
}
export default class TaskController extends ControllerBase {
  @epMeta({
    method: 'post',
    version: '1.0',
    path: 'task',
    isAuthorized: true,
    middleware: [
      check('title')
        .notEmpty()
        .withMessage(R.titleRequiredForTask)
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage(R.titleLengthForTask),
    ],
  })
  public async createTask(req: ValidatedAuthorizedRequest<TaskInput>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
      }
      if (!req.body.description) {
        req.body.description = '';
      }
      const task = await TaskManager.createTask(req.body, req.user);
      return res.send(task);
    } catch (err) {
      next(err);
    }
  }

  @epMeta({
    method: 'get',
    version: '1.0',
    path: 'tasks/:tenantId?',
    isAuthorized: true,
  })
  public async listTasks(req: AuthorizedRequest<{ tenantId?: string }>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
      }

      const tenantId = req.params.tenantId ? parseInt(req.params.tenantId, 10) : undefined;

      if (tenantId && req.user.tenantId !== tenantId) {
        throw new ForbiddenException();
      }

      const task = await TaskManager.listTasks(req.user, tenantId);
      return res.send(task);
    } catch (err) {
      next(err);
    }
  }

  @epMeta({
    method: 'delete',
    version: '1.0',
    path: 'tasks',
    isAuthorized: true,
  })
  public async removeTasks(req: AuthorizedRequest<{}, number[]>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
      }

      await TaskManager.removeTasks(req.body, req.user);
      return res.send({ message: req.t(R.deleteSuccessful) });
    } catch (err) {
      next(err);
    }
  }

  @epMeta({
    method: 'patch',
    version: '1.0',
    path: 'task/:id',
    isAuthorized: true,
  })
  public async updateTask(req: AuthorizedRequest<{ id: string }, TaskInput>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
      }

      const taskId = req.params.id ? parseInt(req.params.id, 10) : undefined;

      if (!taskId) {
        throw new BadRequestException(req.t(R.idRequiredAndMustBeNumber));
      }

      if (taskId !== req.body.id) {
        throw new BadRequestException();
      }

      const task = await TaskManager.updateTask(taskId, req.body, req.user);
      return res.send(task);
    } catch (err) {
      next(err);
    }
  }
}
