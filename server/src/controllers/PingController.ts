import { Request, Response } from 'express';
import { epMeta } from '../decorators/api.decorators';
import { ControllerBase } from '../types/api';

export default class PingController extends ControllerBase {
  @epMeta({
    method: 'get',
    path: 'ping',
    version: '1.0',
  })
  public async ping(_: Request<{}, {}, {}>, res: Response) {
    return res.send({ message: 'Pong!' });
  }
}
