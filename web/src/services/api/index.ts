import { AuthManager, TaskManager, UserManager } from '@tdd-sandbox/api-managers';
import { request } from '@tdd-sandbox/request';
import { serverUrl } from '../../config';

export const authManager = new AuthManager(request, serverUrl);
export const taskManager = new TaskManager(request, serverUrl);
export const userManager = new UserManager(request, serverUrl);
