import { mockAuthManager } from './managers/MockAuthManager';
import { mockTaskManager } from './managers/MockTaskManager';
import { mockUserManager } from './managers/MockUserManager';

export const handlers = [
  ...Object.values(mockAuthManager),
  ...Object.values(mockUserManager),
  ...Object.values(mockTaskManager),
];
