import { request } from '@tdd-sandbox/request';
import { serverUrl } from '../../config';
import { AuthManager } from '../../managers/AuthManager';
import { TaskManager } from '../../managers/TaskManager';
import { UserManager } from '../../managers/UserManager';

export const authManager = new AuthManager(request, serverUrl);
export const taskManager = new TaskManager(request, serverUrl);
export const userManager = new UserManager(request, serverUrl);
