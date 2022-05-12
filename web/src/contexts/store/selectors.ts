import { personalWs, StoreData } from './types';

export const selectActiveWorkspace = (store: StoreData) => ({
  workspace: store.activeWS,
  isPersonal: store.activeWS === personalWs,
});
export const selectWorkspaceTasks = (store: StoreData) => store.workspaces[store.activeWS];
