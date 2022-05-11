import { NextFunction, Response } from 'express';
import { TenantManager } from '../BLL/TenantManager';

import { epMeta } from '../decorators/api.decorators';
import { AuthorizedRequest, ControllerBase } from '../types/api';

export default class TenantController extends ControllerBase {
  @epMeta({
    method: 'get',
    version: '1.0',
    path: 'tenants/user',
    isAuthorized: true,
  })
  public async getTenantsForUser(req: AuthorizedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
      }
      const tenants = await TenantManager.getTenantsForUser(req.user);
      return res.send(tenants);
    } catch (err) {
      next(err);
    }
  }
}
