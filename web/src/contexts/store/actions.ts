import { action } from 'typesafe-actions';
import { Task } from './types';

export const createTask = (task: Task) => action('todo.io/create-task', task);
export const removeTask = (task: Task) => action('todo.io/remove-task', task);
