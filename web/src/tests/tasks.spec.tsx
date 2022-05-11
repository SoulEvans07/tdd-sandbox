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

  it('clears the create task input when enter is pressed', () => {
    userEvent.clear(createTaskInput);
    userEvent.type(createTaskInput, 'Read for at least an hour');
    userEvent.type(createTaskInput, '{enter}');
    expect(createTaskInput).toHaveValue('');
  });
});
