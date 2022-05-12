import { NextFunction, Response } from 'express';
import { check } from 'express-validator';
import { userInfo } from 'os';
import { TaskManager } from '../BLL/TaskManager';
import { TaskInput } from '../DAL/models/Task';
import { epMeta } from '../decorators/api.decorators';
import { AuthorizedRequest, ControllerBase, ValidatedAuthorizedRequest } from '../types/api';
import { ForbiddenException } from '../types/exceptions/ForbiddenException';
import { R } from '../types/localization';

export default class TaskController extends ControllerBase {
  @epMeta({
    method: 'post',
    version: '1.0',
    path: 'tasks',
    isAuthorized: true,
    middleware: [
      check('title')
        .notEmpty()
        .withMessage(R.titleRequiredForTask)
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage(R.titleLengthForTask),
      check('description').notEmpty().withMessage(R.descriptionRequiredForTask),
    ],
  })
  public async createTask(req: ValidatedAuthorizedRequest<TaskInput>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
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
  public async listTasks(req: AuthorizedRequest, res: Response, next: NextFunction) {
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
}
