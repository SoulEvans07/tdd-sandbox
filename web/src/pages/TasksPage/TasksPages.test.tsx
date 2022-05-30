import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../../router/types';
import { TasksPage } from './TasksPage';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { AuthProvider } from '../../contexts/auth/AuthContext';
import { ThemeProvider } from '../../contexts/theme/ThemeContext';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { MockUserData, mockUsers } from '../../mocks/controllers/mockData';

describe('TasksPage', () => {
  let createTaskInput: HTMLInputElement;
  let profileImg: HTMLElement;

  const setupTaskPage = (user: MockUserData) => {
    render(
      <MemoryRouter initialEntries={[ROUTES.TASKS]}>
        <ThemeProvider initial="dark">
          <AuthProvider initial={{ currentUser: user.data, token: user.token }}>
            <StoreProvider>
              <TasksPage />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    createTaskInput = screen.getByRole('textbox', { name: /new task/i }) as HTMLInputElement;
    profileImg = screen.getByTitle(user.data.username) as HTMLInputElement;
  };

  supressErrorMessages();

  it('page composition', () => {
    setupTaskPage(mockUsers[0]);
    expect(createTaskInput).toBeInTheDocument();
    expect(profileImg).toBeInTheDocument();
  });

  test('clicking on the profile image opens/closes the user menu', () => {
    // TODO: implement @adam.szi
  });

  describe('create task', () => {
    it('has empty list message if no data found on store or retreived from server', () => {
      setupTaskPage(mockUsers[2]);
      const emptyListMessage = screen.getByText('There is nothing here!');
      expect(emptyListMessage).toBeInTheDocument();
    });

    it('doesnt add item when input is empty but enter is pressed', () => {
      setupTaskPage(mockUsers[2]);

      userEvent.clear(createTaskInput);
      userEvent.type(createTaskInput, '{enter}');

      const taskItem = screen.queryByTestId(/task-item-/i);
      expect(taskItem).not.toBeInTheDocument();
    });

    it('clears input and adds item to list when enter is pressed', async () => {
      setupTaskPage(mockUsers[2]);

      const title = 'New Task Title';
      userEvent.clear(createTaskInput);
      userEvent.type(createTaskInput, title);
      userEvent.type(createTaskInput, '{enter}');

      expect(createTaskInput).toHaveValue('');
      const taskItem = await screen.findByTestId(/task-item-/i);
      expect(taskItem).toBeInTheDocument();
      expect(taskItem).toHaveTextContent(title);
    });

    it('deletes a task when the remove button is pressed', async () => {
      const user = mockUsers[1];
      setupTaskPage(user);
      const task = user.tasks[0];

      const taskItem = await screen.findByText(task.title);
      expect(taskItem).toBeInTheDocument();

      const removeBtn = screen.getByTestId(`remove-task-${task.id}`);
      expect(removeBtn).toBeInTheDocument();

      userEvent.click(removeBtn);
      await waitForElementToBeRemoved(() => screen.queryByText(task.title));

      // wait until last updates are done so they dont throw error when the test unmounts the components
      await new Promise(res => setTimeout(res, 1000));
    });
  });

  describe('edit task', () => {
    it('opens the edit panel when you click on a task, closes when close btn pressed', async () => {
      const user = mockUsers[0];
      setupTaskPage(user);
      const task = user.tasks[0];

      const noEditor = screen.queryByRole('complementary', { name: /edit panel/i });
      expect(noEditor).not.toBeInTheDocument();

      const taskItem = await screen.findByText(task.title);
      userEvent.click(taskItem);

      const editor = screen.getByRole('complementary', { name: /edit panel/i });
      expect(editor).toBeVisible();

      const closeBtn = screen.getByRole('button', { name: /close edit panel/i });
      userEvent.click(closeBtn!);

      await waitFor(() => expect(editor).not.toBeVisible());
    });

    describe('submit change', () => {
      const newTitle = 'Changed Task Title';
      const newDescription = 'Changed Task Description';

      test('title change', async () => {
        const user = mockUsers[0];
        setupTaskPage(user);
        const task = user.tasks[0];

        const taskItem = await screen.findByText(task.title);
        userEvent.click(taskItem);

        const titleInput = screen.getByRole('textbox', { name: /title/i });
        userEvent.clear(titleInput);
        userEvent.type(titleInput, newTitle);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        expect(saveBtn).toBeEnabled();
        userEvent.click(saveBtn);

        await waitFor(() => expect(saveBtn).toBeDisabled());
        expect(screen.getByTestId(`task-item-${task.id}`)).toHaveTextContent(newTitle);
      });

      test('description change', async () => {
        const user = mockUsers[0];
        setupTaskPage(user);
        const task = user.tasks[0];

        const taskItem = await screen.findByText(task.title);
        userEvent.click(taskItem);

        const descriptionTA = screen.getByRole('textbox', { name: /description/i });
        userEvent.clear(descriptionTA);
        userEvent.type(descriptionTA, newDescription);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        expect(saveBtn).toBeEnabled();
        userEvent.click(saveBtn);

        await waitFor(() => expect(saveBtn).toBeDisabled());
      });

      // describe.each<{ status: TaskStatus; options: TaskStatus[] }>([
      //   { status: 'Todo', options: ['InProgress'] },
      //   { status: 'InProgress', options: ['Blocked', 'Done'] },
      //   { status: 'Blocked', options: ['Todo', 'InProgress'] },
      // ])('status transitions', ({ status, options }) => {
      //   test.each(options)(`${status} => %s`, async option => {
      //     const task = { ...mockTask, status };
      //     render(<MockTaskPage task={task} open />);
      //     const statusLabel = await screen.findByText(TaskStatusNames[status]);

      //     const nextStatusBtn = screen.getByRole('button', { name: TaskStatusNames[option] });
      //     userEvent.click(nextStatusBtn);

      //     await waitFor(() => expect(statusLabel).toHaveTextContent(TaskStatusNames[option]));
      //   });
      // });
    });
  });
});
