import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { initialStoreData, StoreData } from './types';
import * as actions from './actions';

export function rootReducer(state: StoreData, action: ActionType<typeof actions>): StoreData {
  switch (action.type) {
    case 'todo.io/load-tasks':
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
    case 'todo.io/load-workspaces':
      return produce(state, draft => {
        action.payload.forEach(ws => {
          draft.workspaces[ws.id] = { id: String(ws.id), name: ws.name, tasks: [] };
        });
      });
    case 'todo.io/change-workspace':
      return produce(state, draft => {
        draft.activeWS = action.payload.workspaceId;
      });
    case 'todo.io/clear-data':
      return initialStoreData;
    default:
      return state;
  }
}
