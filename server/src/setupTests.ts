import dotenv from 'dotenv';

// TODO: solve config parsing from config.ts
dotenv.config({ path: './.env.test' });

import sequelize from './DAL/database';
import { seed } from './seeder';

beforeAll(async () => {
  await sequelize.sync();
  await seed();
});
