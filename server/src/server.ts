import http from 'http';
import { app, setupRestControllers } from './app';
import { setupSocketControllers } from './socket';

export function setupServer(): http.Server {
  const server = http.createServer(app);

  const io = setupSocketControllers(server);
  setupRestControllers(app, io);

  return server;
}
