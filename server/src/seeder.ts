import { UserManager } from './BLL/UserManager';
import sequelize from './DAL/database';
import User, { UserInput } from './DAL/models/User';
import { Logger } from './utils/Logger';

const defaultUsers: UserInput[] = [
  { username: 'adam.szi', email: 'adam.szi@snapsoft.hu', password: 'Pass123!' },
  { username: 'andrash.balogh', email: 'andrash.balogh@snapsoft.hu', password: 'Pass123!' },
  { username: 'tamas.horvath', email: 'tamas.horvath@snapsoft.hu', password: 'Pass123!' },
  { username: 'test.user', email: 'test.user@other.hu', password: 'Pass123!' },
  { username: 'other.user', email: 'other.user@other.hu', password: 'Pass123!' },
  { username: 'another.user', email: 'another.user@other.hu', password: 'Pass123!' },
];

async function createUser(user: UserInput) {
  const foundUser = await User.findOne({ where: { username: user.username } });
  if (foundUser) return;

  await UserManager.save(user);
  Logger.log(`Default user ${user.username} created`);
}

export async function seed() {
  for await (const user of defaultUsers) {
    await createUser(user);
  }
}
