import config from '../config/config';
import { Sequelize } from 'sequelize';

if (!config.database.name) {
  throw Error('DB_NAME required!');
}

if (!config.database.user) {
  throw Error('DB_USER required!');
}

if (!config.database.password) {
  throw Error('DB_PASSWORD required!');
}

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  dialect: 'sqlite',
  storage: config.database.storage,
  logging: false,
});

export default sequelize;
