import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { StoreConsumer, StoreContext, StoreProvider, useDispatch } from './StoreContext';
import { personalWs, StoreData, Task } from './types';
import * as actions from './actions';
import { ActionType } from 'typesafe-actions';

describe('AuthContext', () => {
  supressErrorMessages();

  const customRender = (ui: ReactNode, data?: StoreData) => {
    return render(<StoreProvider initial={data}>{ui}</StoreProvider>);
  };

  const mockStoreConcumer = (children?: ReactNode) => (value: StoreContext | undefined) => {
    if (!value) return <></>;
    const { data } = value;
    const { activeWS, workspaces } = data;
    return (
      <>
        {children}
        <div>active: {activeWS}</div>
        {Object.entries(workspaces).map(([id, ws]) => (
          <div key={id}>
            <div>workspace: {ws.name}</div>
            <div>
              {ws.name} count: {ws.tasks.length}
            </div>
            <ul>
              {ws.tasks.map(t => (
                <li key={t.id} data-testid={`${ws.id}-task-${t.id}`}>
                  task: {t.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  };

  const testForDefaultData = () => {
    expect(screen.getByText('active: ' + personalWs)).toBeInTheDocument();
    expect(screen.getByText('workspace: Personal')).toBeInTheDocument();
    expect(screen.getByText('Personal count: 0')).toBeInTheDocument();
    expect(screen.queryByTestId('task: ', { exact: false })).not.toBeInTheDocument();
  };

  it('uses default value', () => {
    customRender(<StoreConsumer>{mockStoreConcumer()}</StoreConsumer>);
    testForDefaultData();
  });

  const mockData: StoreData = {
    activeWS: 11,
    workspaces: {
      _personal: {
        id: '_personal',
        name: 'Personal',
        tasks: [],
      },
      '11': {
        id: '11',
        name: 'Company',
        tasks: [
          { id: 0, title: 'Task 1', status: 'Todo', description: '' },
          { id: 1, title: 'Task 2', status: 'Todo', description: '' },
        ],
      },
    },
  };

  const testForMockData = () => {
    expect(screen.getByText('workspace: ' + mockData.workspaces._personal.name)).toBeInTheDocument();
    expect(screen.getByText(mockData.workspaces._personal.name + ' count: 0')).toBeInTheDocument();
    expect(screen.queryByTestId(/_personal-task-/i)).not.toBeInTheDocument();

    expect(screen.getByText('active: ' + mockData.activeWS)).toBeInTheDocument();
    expect(screen.getByText('workspace: ' + mockData.workspaces['11'].name)).toBeInTheDocument();
    expect(
      screen.getByText(mockData.workspaces['11'].name + ' count: ' + mockData.workspaces['11'].tasks.length)
    ).toBeInTheDocument();
    mockData.workspaces['11'].tasks.forEach(task => {
      expect(screen.getByText(task.title, { exact: false })).toBeInTheDocument();
    });
  };

  it('uses initial value', () => {
    customRender(<StoreConsumer>{mockStoreConcumer()}</StoreConsumer>, mockData);
    testForMockData();
  });

  describe('actions/reducers', () => {
    const ActionButton = (props: { action: ActionType<typeof actions>; text: string }) => {
      const { action, text } = props;
      const dispatch = useDispatch();
      const onClick = () => dispatch(action);
      return <button onClick={onClick}>{text}</button>;
    };

    test('clearData()', () => {
      const actionBtn = <ActionButton action={actions.clearData()} text="Clear" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>, mockData);
      testForMockData();

      const btn = screen.getByRole('button', { name: /clear/i });
      userEvent.click(btn);
      testForDefaultData();
    });

    test('changeWorkspace(_personal)', () => {
      const actionBtn = <ActionButton action={actions.changeWorkspace(personalWs)} text="Change" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>, mockData);
      testForMockData();

      const btn = screen.getByRole('button', { name: /change/i });
      userEvent.click(btn);
      expect(screen.getByText('active: ' + personalWs)).toBeInTheDocument();
    });

    test('loadWorkspaces([{ id: 11, name: Company }])', () => {
      const newWorkspace = { id: 11, name: 'Company' };
      const actionBtn = <ActionButton action={actions.loadWorkspaces([newWorkspace])} text="Load" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>);
      testForDefaultData();

      const btn = screen.getByRole('button', { name: /load/i });
      userEvent.click(btn);
      expect(screen.getByText('workspace: ' + newWorkspace.name)).toBeInTheDocument();
    });

    test('loadTasks([...], _personal)', () => {
      const newTasks: Task[] = [
        { id: 0, title: 'New Task 1', status: 'Todo', description: '' },
        { id: 1, title: 'New Task 2', status: 'Todo', description: '' },
      ];
      const actionBtn = <ActionButton action={actions.loadTasks(newTasks, personalWs)} text="Load" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>);
      testForDefaultData();

      const btn = screen.getByRole('button', { name: /load/i });
      userEvent.click(btn);
      newTasks.forEach(task => {
        expect(screen.getByText(task.title, { exact: false })).toBeInTheDocument();
      });
    });

    test('createTask()', () => {
      const newTask: Task = { id: 123, title: 'New Task 1', status: 'Todo', description: '' };
      const actionBtn = <ActionButton action={actions.createTask(newTask)} text="create" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>, mockData);
      testForMockData();

      const btn = screen.getByRole('button', { name: /create/i });
      userEvent.click(btn);
      const taskLi = screen.getByText(newTask.title, { exact: false });
      expect(taskLi).toBeInTheDocument();
      expect(taskLi).toHaveAttribute('data-testid', mockData.activeWS + '-task-' + newTask.id);
    });

    test('removeTask(1)', () => {
      const actionBtn = <ActionButton action={actions.removeTask(1)} text="remove" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>, mockData);
      testForMockData();

      const btn = screen.getByRole('button', { name: /remove/i });
      userEvent.click(btn);

      const removedTask = screen.queryByTestId('11-task-1');
      expect(removedTask).not.toBeInTheDocument();
      expect(screen.getByText(mockData.workspaces['11'].name + ' count: ' + 1)).toBeInTheDocument();
    });

    test('removeMultipleTask([1, 0])', () => {
      const actionBtn = <ActionButton action={actions.removeMultipleTask([1, 0])} text="remove" />;
      customRender(<StoreConsumer>{mockStoreConcumer(actionBtn)}</StoreConsumer>, mockData);
      testForMockData();

      const btn = screen.getByRole('button', { name: /remove/i });
      userEvent.click(btn);

      const removedTasks = screen.queryByTestId(/11-task-/i);
      expect(removedTasks).not.toBeInTheDocument();
      expect(screen.getByText(mockData.workspaces['11'].name + ' count: ' + 0)).toBeInTheDocument();
    });
  });
});
