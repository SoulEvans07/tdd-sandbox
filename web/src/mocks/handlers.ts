import { mockAuthController } from './controllers/MockAuthController';
import { mockUserController } from './controllers/MockUserController';

export const handlers = [...Object.values(mockAuthController), ...Object.values(mockUserController)];
