import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { StoreData } from './types';
import * as actions from './actions';

export function rootReducer(state: StoreData, action: ActionType<typeof actions>): StoreData {
  switch (action.type) {
    case 'todo.io/create-task':
      return produce(state, draft => {
        draft.workspaces[draft.activeWS].push(action.payload);
      });
    case 'todo.io/remove-task':
      return produce(state, draft => {
        draft.workspaces[draft.activeWS] = draft.workspaces[draft.activeWS].filter(
          task => task.id !== action.payload.id
        );
      });
    default:
      return state;
  }
}
