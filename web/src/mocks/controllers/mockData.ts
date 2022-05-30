import { Task } from '../../contexts/store/types';

export const mockPassword = 'StrongP4$$';

export interface MockTenantData {
  id: number;
  name: string;
  tasks: Task[];
}

export const mockTenants: MockTenantData[] = [
  {
    id: 1,
    name: 'snapsoft.hu',
    tasks: [
      { tenantId: 1, id: 100, order: 0, title: 'Open Task 1', description: '', status: 'Todo' },
      { tenantId: 1, id: 101, order: 1, title: 'Open Task 2', description: '', status: 'Todo' },
      { tenantId: 1, id: 102, order: 2, title: 'Done Task 1', description: '', status: 'Done' },
      { tenantId: 1, id: 103, order: 3, title: 'WIP Task 1', description: '', status: 'InProgress' },
      { tenantId: 1, id: 104, order: 4, title: 'WIP Task 2', description: '', status: 'InProgress' },
      { tenantId: 1, id: 105, order: 5, title: 'Blocked Task 1', description: '', status: 'Blocked' },
      { tenantId: 1, id: 106, order: 6, title: 'WIP Task 3', description: '', status: 'InProgress' },
      { tenantId: 1, id: 107, order: 7, title: 'Open Task 3', description: '', status: 'Todo' },
      { tenantId: 1, id: 108, order: 8, title: 'Done Task 2', description: '', status: 'Done' },
      { tenantId: 1, id: 109, order: 9, title: 'Done Task 3', description: '', status: 'Done' },
    ],
  },
  {
    id: 2,
    name: 'simonyi.bme.hu',
    tasks: [{ tenantId: 2, id: 200, order: 0, title: 'Open Task 1', description: '', status: 'Todo' }],
  },
];

export const mockTenantsTable = mockTenants.map(t => ({ id: t.id, name: t.name }));

export interface MockUserData {
  data: {
    id: number;
    username: string;
    email: string;
    tenants: number[];
  };
  password: string;
  token: string;
  refreshedToken: string;
  tenants: MockTenantData[];
  tasks: Task[];
}

export const mockUsers: MockUserData[] = [
  {
    data: {
      id: 1,
      username: 'test.user',
      email: 'test.user@snapsoft.hu',
      tenants: [mockTenantsTable[0].id],
    },
    password: mockPassword,
    token: 'test.user.super.secret.token',
    refreshedToken: 'refreshed.test.user.super.secret.token',
    tenants: [mockTenants[0]],
    tasks: [
      { assigneeId: 1, id: 0, order: 0, title: 'Open Task 1', description: '', status: 'Todo' },
      { assigneeId: 1, id: 1, order: 1, title: 'Open Task 2', description: '', status: 'Todo' },
      { assigneeId: 1, id: 2, order: 2, title: 'Done Task 1', description: '', status: 'Done' },
      { assigneeId: 1, id: 3, order: 3, title: 'WIP Task 1', description: '', status: 'InProgress' },
      { assigneeId: 1, id: 4, order: 4, title: 'WIP Task 2', description: '', status: 'InProgress' },
      { assigneeId: 1, id: 5, order: 5, title: 'Blocked Task 1', description: '', status: 'Blocked' },
      { assigneeId: 1, id: 6, order: 6, title: 'WIP Task 3', description: '', status: 'InProgress' },
      { assigneeId: 1, id: 7, order: 7, title: 'Open Task 3', description: '', status: 'Todo' },
      { assigneeId: 1, id: 8, order: 8, title: 'Done Task 2', description: '', status: 'Done' },
      { assigneeId: 1, id: 9, order: 9, title: 'Done Task 3', description: '', status: 'Done' },
    ],
  },
  {
    data: {
      id: 2,
      username: 'other.user',
      email: 'other.user@snapsoft.hu',
      tenants: [mockTenantsTable[0].id],
    },
    password: mockPassword,
    token: 'other.user.super.secret.token',
    refreshedToken: 'refreshed.other.user.super.secret.token',
    tenants: [mockTenants[0]],
    tasks: [
      { assigneeId: 2, id: 0, order: 0, title: 'Open Task 1', description: '', status: 'Todo' },
      { assigneeId: 2, id: 1, order: 1, title: 'Open Task 2', description: '', status: 'Todo' },
    ],
  },
  {
    data: {
      id: 3,
      username: 'outside.user',
      email: 'outside.user@simonyi.bme.hu',
      tenants: [mockTenantsTable[1].id],
    },
    password: mockPassword,
    token: 'outside.user.super.secret.token',
    refreshedToken: 'refreshed.outside.user.super.secret.token',
    tenants: [mockTenants[1]],
    tasks: [],
  },
];
