import { Logger } from './utils/Logger';
import http from 'http';
import { app, setupRestControllers } from './app';
import sequelize from './DAL/database';
import config from './config/config';
import { seed } from './seeder';
import { setupSocketControllers } from './socket';

try {
  sequelize.sync().then(() => seed());
  const server = http.createServer(app);

  const io = setupSocketControllers(server);
  setupRestControllers(app, io);

  server.listen(config.server.port, () => {
    Logger.log(`Server is running at https://localhost:${config.server.port}`);
  });
} catch (error) {
  Logger.log(`Error occurred: ${(error as any).message}`);
}
