import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../router/types';
import { TasksPage } from '../pages/TasksPage/TasksPage';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import userEvent from '@testing-library/user-event';

describe('tasks behavior', () => {
  const user = {
    id: 0,
    username: 'adam.szi',
    email: 'adam.szi@snapsoft.hu',
    tenants: [1],
  };
  const jwtToken = 'random.super.secretToken';

  let createTaskInput: HTMLInputElement;
  let profileImg: HTMLElement;

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={[ROUTES.TASKS]}>
        <ThemeProvider initial="dark">
          <AuthProvider initial={{ currentUser: user, token: jwtToken }}>
            <TasksPage />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    createTaskInput = screen.getByRole('textbox', { name: /new task/i }) as HTMLInputElement;
    profileImg = screen.getByTitle(user.username) as HTMLInputElement;
  });

  it('page composition', () => {
    expect(createTaskInput).toBeInTheDocument();
    expect(profileImg).toBeInTheDocument();
  });

  describe('create task', () => {
    it('has an empty list message at first', () => {
      const emptyListMessage = screen.getByText('There is nothing to do!');
      expect(emptyListMessage).toBeInTheDocument();
    });

    it('doesnt add item when input is empty but enter is pressed', () => {
      userEvent.clear(createTaskInput);
      userEvent.type(createTaskInput, '{enter}');
      const taskItem = screen.queryByTestId(/task-item-/i);
      expect(taskItem).not.toBeInTheDocument();
    });

    it('clears input and adds item to list when enter is pressed', async () => {
      const newTaskTitle = 'Read for at least an hour';
      userEvent.clear(createTaskInput);
      userEvent.type(createTaskInput, newTaskTitle);
      userEvent.type(createTaskInput, '{enter}');
      expect(createTaskInput).toHaveValue('');
      const taskItem = await screen.findByTestId(/task-item-/i);
      expect(taskItem).toBeInTheDocument();
      expect(taskItem).toHaveTextContent(newTaskTitle);
    });
  });
});
