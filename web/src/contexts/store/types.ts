export type TaskStatus = 'Todo' | 'InProgress' | 'Blocked' | 'Done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export const personalWs = '_personal' as const;

export interface Workspace {
  id: string;
  name: string;
  tasks: Task[];
}

export type WorkspaceMap = {
  [personalWs]: Workspace;
  [wsname: string]: Workspace;
};

export interface StoreData {
  activeWS: keyof WorkspaceMap;
  workspaces: WorkspaceMap;
}

export type StoreSelector<T> = (store: StoreData) => T;

export const initialStoreData: StoreData = {
  activeWS: personalWs,
  workspaces: {
    [personalWs]: {
      id: personalWs,
      name: 'Personal',
      tasks: [],
    },
  },
};
