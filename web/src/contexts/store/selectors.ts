import { StoreData } from './types';

export const selectActiveWorkspace = (store: StoreData) => store.workspaces[store.activeWS];
