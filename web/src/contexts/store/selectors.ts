import { personalWs, StoreData } from './types';

export const selectWorkspaces = (store: StoreData) => store.workspaces;
export const selectActiveWorkspace = (store: StoreData) => ({
  workspace: store.workspaces[store.activeWS],
  isPersonal: store.activeWS === personalWs,
});
export const selectWorkspaceTasks = (store: StoreData) => store.workspaces[store.activeWS].tasks;
