import { Request, Response, NextFunction } from 'express';
import { Server as SocketServer } from 'socket.io';

export class SocketMiddleware {
  public static attachIO(io: SocketServer) {
    return (_: Request, res: SocketResponse, next: NextFunction) => {
      res.io = io;
      return next();
    };
  }
}

export interface SocketResponse<ResBody = any, Locals extends Record<string, any> = Record<string, any>>
  extends Response<ResBody, Locals> {
  io?: SocketServer;
}
