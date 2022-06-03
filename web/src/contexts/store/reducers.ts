import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { initialStoreData, personalWs, StoreData } from './types';
import * as actions from './actions';

export function rootReducer(state: StoreData, action: ActionType<typeof actions>): StoreData {
  console.log('[action]', action.type);
  switch (action.type) {
    case 'todo.io/load-tasks':
      // console.log('[load-tasks]', action.payload.tasks.length);
      return produce(state, draft => {
        draft.workspaces[action.payload.wsId].tasks = action.payload.tasks;
      });
    case 'todo.io/create-task':
      return produce(state, draft => {
        draft.workspaces[draft.activeWS].tasks.push(action.payload);
      });
    case 'todo.io/remove-task':
      return produce(state, draft => {
        draft.workspaces[draft.activeWS].tasks = draft.workspaces[draft.activeWS].tasks.filter(
          task => task.id !== action.payload
        );
      });
    case 'todo.io/remove-multiple-task':
      return produce(state, draft => {
        draft.workspaces[draft.activeWS].tasks = draft.workspaces[draft.activeWS].tasks.filter(
          task => !action.payload.includes(task.id)
        );
      });
    case 'todo.io/update-task':
      return produce(state, draft => {
        const task = action.payload;
        const isTaskPersonal = task.tenantId == null;
        const isTaskCurrentWs = draft.activeWS === personalWs ? isTaskPersonal : task.tenantId === draft.activeWS;
        const taskIndex = draft.workspaces[draft.activeWS].tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          if (isTaskCurrentWs) {
            draft.workspaces[draft.activeWS].tasks[taskIndex] = task;
          } else {
            draft.workspaces[draft.activeWS].tasks.splice(taskIndex, 1);
          }
        }
      });
    case 'todo.io/load-workspaces':
      return produce(state, draft => {
        action.payload.forEach(ws => {
          draft.workspaces[ws.id] = { id: String(ws.id), name: ws.name, tasks: [] };
        });
      });
    case 'todo.io/change-workspace':
      // console.log('[change-workspace]', action.payload.workspaceId);
      return produce(state, draft => {
        draft.activeWS = action.payload.workspaceId;
      });
    case 'todo.io/clear-data':
      return initialStoreData;
    default:
      return state;
  }
}
