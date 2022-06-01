import { Logger } from './utils/Logger';
import { app } from './app';
import sequelize from './DAL/database';
import config from './config/config';
import { seed } from './seeder';

try {
  sequelize.sync().then(() => seed());

  app.listen(config.server.port, () => {
    Logger.log(`Server is running at https://localhost:${config.server.port}`);
  });
} catch (error) {
  Logger.log(`Error occurred: ${(error as any).message}`);
}
