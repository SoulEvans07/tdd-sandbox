import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../router/types';
import { TasksPage } from '../pages/TasksPage/TasksPage';
import { StoreProvider } from '../contexts/store/StoreContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { StoreData, Task } from '../contexts/store/types';
import { mockNewTask } from '../mocks/controllers/MockTaskController';
import { mockJwtToken } from '../mocks/controllers/mockData';

describe('tasks behavior', () => {
  let createTaskInput: HTMLInputElement;
  let profileImg: HTMLElement;

  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });
  afterAll(() => spy.mockRestore());

  const setupTaskPage = (init?: StoreData) => {
    const user = {
      id: 0,
      username: 'adam.szi',
      email: 'adam.szi@snapsoft.hu',
      tenants: [1],
    };
    render(
      <MemoryRouter initialEntries={[ROUTES.TASKS]}>
        <ThemeProvider initial="dark">
          <AuthProvider initial={{ currentUser: user, token: mockJwtToken }}>
            <StoreProvider initial={init}>
              <TasksPage />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    createTaskInput = screen.getByRole('textbox', { name: /new task/i }) as HTMLInputElement;
    profileImg = screen.getByTitle(user.username) as HTMLInputElement;
  };

  it('page composition', () => {
    setupTaskPage();
    expect(createTaskInput).toBeInTheDocument();
    expect(profileImg).toBeInTheDocument();
  });

  test('clicking on the profile image opens/closes the user menu', () => {
    // TODO: implement @adam.szi
  });

  describe('create task', () => {
    it('has empty list message  if no data found on store or retreived from server', () => {
      setupTaskPage();
      const emptyListMessage = screen.getByText('There is nothing here!');
      expect(emptyListMessage).toBeInTheDocument();
    });

    it('doesnt add item when input is empty but enter is pressed', () => {
      setupTaskPage();
      userEvent.clear(createTaskInput);
      userEvent.type(createTaskInput, '{enter}');
      const taskItem = screen.queryByTestId(/task-item-/i);
      expect(taskItem).not.toBeInTheDocument();
    });

    it('clears input and adds item to list when enter is pressed', async () => {
      setupTaskPage();
      userEvent.clear(createTaskInput);
      userEvent.type(createTaskInput, mockNewTask.title);
      userEvent.type(createTaskInput, '{enter}');
      expect(createTaskInput).toHaveValue('');
      const taskItem = await screen.findByTestId(/task-item-/i);
      expect(taskItem).toBeInTheDocument();
      expect(taskItem).toHaveTextContent(mockNewTask.title);
    });

    it('deletes a task when the remove button is pressed', async () => {
      const task: Task = { id: 0, title: 'Existing Task', status: 'Todo' };
      setupTaskPage({
        activeWS: '_personal',
        workspaces: {
          _personal: [task],
        },
      });

      const taskItem = screen.getByText(task.title);
      expect(taskItem).toBeInTheDocument();

      const removeBtn = screen.getByRole('button', { name: /remove/i });
      expect(removeBtn).toBeInTheDocument();

      userEvent.click(removeBtn);
      await waitForElementToBeRemoved(() => screen.queryByText(task.title));

      // wait until last updates are done so they dont throw error when the test unmounts the components
      await new Promise(res => setTimeout(res, 1000));
    });
  });
});
