import { Logger } from './utils/Logger';
import { app } from './app';
import sequelize from './DAL/database';
import config from './config/config';
import User from './DAL/models/User';
import { mockUser } from './tests/mocks';
import SecurityHelper from './utils/SecurityHelper';

try {
  sequelize.sync({ force: true }).then(() => {
    SecurityHelper.hashPassword(mockUser.password).then(password => {
      User.findOne({ where: { username: mockUser.username } }).then(user => {
        if (!user) {
          User.create({ ...mockUser, password }).then(() => {
            Logger.log('Default user created');
          });
        }
      });
    });
  });

  app.listen(config.server.port, () => {
    Logger.log(`Server is running at https://localhost:${config.server.port}`);
  });
} catch (error) {
  Logger.log(`Error occurred: ${(error as any).message}`);
}
