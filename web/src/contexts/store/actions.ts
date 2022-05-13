import { action } from 'typesafe-actions';
import { Task, Workspaces } from './types';

export const loadTasks = (tasks: Task[], wsId: keyof Workspaces) => action('todo.io/load-tasks', { tasks, wsId });
export const createTask = (task: Task) => action('todo.io/create-task', task);
export const removeTask = (taskId: Task['id']) => action('todo.io/remove-task', taskId);
export const removeMultipleTask = (taskIds: Array<Task['id']>) => action('todo.io/remove-multiple-task', taskIds);
