export type TaskStatus = 'Todo' | 'InProgress' | 'Blocked' | 'Done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export const personalWs = '_personal' as const;

export type Workspaces = {
  [personalWs]: Task[];
  [wsname: number]: Task[];
};

export interface StoreData {
  activeWS: keyof Workspaces;
  workspaces: Workspaces;
}

export type StoreSelector<T> = (store: StoreData) => T;

export const initialStoreData: StoreData = {
  activeWS: personalWs,
  workspaces: {
    [personalWs]: [],
  },
};
