import { mockAuthController } from './controllers/MockAuthController';
import { mockTaskController } from './controllers/MockTaskController';
import { mockUserController } from './controllers/MockUserController';

export const handlers = [
  ...Object.values(mockAuthController),
  ...Object.values(mockUserController),
  ...Object.values(mockTaskController),
];
