import { action } from 'typesafe-actions';
import { Task, WorkspaceMap } from './types';

export const clearData = () => action('todo.io/clear-data');
export const loadTasks = (tasks: Task[], wsId: keyof WorkspaceMap) => action('todo.io/load-tasks', { tasks, wsId });
export const createTask = (task: Task) => action('todo.io/create-task', task);
export const removeTask = (taskId: Task['id']) => action('todo.io/remove-task', taskId);
export const removeMultipleTask = (taskIds: Array<Task['id']>) => action('todo.io/remove-multiple-task', taskIds);
export const updateTask = (task: Task) => action('todo.io/update-task', task);
export const loadWorkspaces = (workspaces: { id: number; name: string }[]) =>
  action('todo.io/load-workspaces', workspaces);
export const changeWorkspace = (workspaceId: string) => action('todo.io/change-workspace', { workspaceId });
