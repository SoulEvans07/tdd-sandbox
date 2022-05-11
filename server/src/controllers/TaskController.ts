import { NextFunction, Response } from 'express';
import { TaskManager } from '../BLL/TaskManager';
import { TaskInput } from '../DAL/models/Task';
import { epMeta } from '../decorators/api.decorators';
import { ControllerBase, ValidatedAuthorizedRequest } from '../types/api';

export default class TaskController extends ControllerBase {
  @epMeta({
    method: 'post',
    version: '1.0',
    path: 'tasks',
    isAuthorized: true,
    middleware: [],
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
}
