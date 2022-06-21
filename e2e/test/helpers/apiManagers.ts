import { AuthManager, TaskManager, UserManager } from '@tdd-sandbox/api-managers';
import { directRequest } from './directReqest';

const serverUrl = 'http://localhost:3001';

export const authManager = new AuthManager(directRequest, serverUrl);
export const taskManager = new TaskManager(directRequest, serverUrl);
export const userManager = new UserManager(directRequest, serverUrl);
