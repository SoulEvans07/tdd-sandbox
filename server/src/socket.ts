import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './config/config';
import { ParsedJwtToken } from './types/api';
import { Logger } from './utils/Logger';
import { UserManager } from './BLL/UserManager';
import { getTenantRoomId } from './utils/idHelpers';

export function setupSocketControllers(server: HttpServer): SocketServer {
  const io = new SocketServer(server, { cors: config.server.cors });

  io.on('connection', socket => {
    Logger.log(`[socket.io] Client connected [ID: ${socket.id}]`);
    socket.emit('connection', null);

    socket.on('auth', async (token: string) => {
      try {
        const decoded: ParsedJwtToken = jwt.verify(token, config.security.tokenKey) as ParsedJwtToken;
        const user = await UserManager.getUserByName(decoded.username);
        if (user) {
          const tenantRoom = getTenantRoomId(user.tenantId);
          socket.join(tenantRoom);
          Logger.log(`[socket.io][ID: ${socket.id}] Joined room: ${tenantRoom}`);
        }
      } catch (err) {
        Logger.log('[socket.io] Error at token validation: ', err);
      }
    });
  });

  return io;
}
