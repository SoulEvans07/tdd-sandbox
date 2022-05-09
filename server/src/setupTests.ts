import dotenv from 'dotenv';

// TODO: solve config parsing from config.ts
dotenv.config({ path: './.env.test' });

import sequelize from './DAL/database';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});
