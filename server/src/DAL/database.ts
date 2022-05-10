import config from '../config/config';
import { Sequelize } from 'sequelize';
import { Logger } from '../utils/Logger';

if (!config.database.name) {
  throw Error('DB_NAME required!');
}

if (!config.database.user) {
  throw Error('DB_USER required!');
}

if (!config.database.password) {
  throw Error('DB_PASSWORD required!');
}

if (!config.database.storage) {
  throw Error('DB_SOURCE required!');
}

if (typeof config.database.logger !== 'boolean') {
  throw Error('DB_LOGGER required!');
}

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  dialect: 'sqlite',
  storage: config.database.storage,
  logging: config.database.logger ? Logger.log : false,
});

export default sequelize;
