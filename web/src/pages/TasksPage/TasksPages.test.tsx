import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../../router/types';
import { TasksPage } from './TasksPage';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { AuthProvider } from '../../contexts/auth/AuthContext';
import { ThemeProvider } from '../../contexts/theme/ThemeContext';
import { supressErrorMessages, waitForMillis } from '../../helpers/testHelpers';
import { MockUserData, mockUsers } from '../../mocks/managers/mockData';
import { selectedItemId } from '../../components/control/FilterSelect/FilterSelect';
import { userProfileId } from '../../containers/AppHeader/AppHeader';
import { Task } from '../../contexts/store/types';

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
    profileImg = screen.getByTestId(userProfileId) as HTMLElement;
  };

  supressErrorMessages();

  it('page composition', () => {
    setupTaskPage(mockUsers[0]);
    expect(createTaskInput).toBeInTheDocument();
    expect(profileImg).toBeInTheDocument();
  });

  async function changeWorkspace(user: MockUserData, workspaceName: string) {
    expect(profileImg).toBeInTheDocument();
    userEvent.click(profileImg);

    await waitFor(async () => {
      const org = await screen.findByRole('option', { name: workspaceName });
      expect(org).toBeVisible();
    });

    const organization = screen.getByRole('option', { name: workspaceName });
    userEvent.click(organization);

    await waitFor(() => {
      const organization = screen.getByRole('option', { name: workspaceName, hidden: true });
      expect(organization).toHaveAttribute('aria-selected', 'true');
    });
  }

  async function waitForTasksToLoad(tasks: Task[]) {
    await waitFor(async () => {
      const orgTask = await screen.findByText(tasks[0].title);
      expect(orgTask).toBeInTheDocument();
    });
  }

  describe('change workspace', () => {
    test('clicking on the profile image opens/closes the user menu', async () => {
      const user = mockUsers[0];
      setupTaskPage(user);
      userEvent.click(profileImg);

      const personal = await screen.findByRole('option', { name: 'Personal' });
      expect(personal).toBeInTheDocument();
      expect(personal).toBeVisible();

      await waitFor(async () => {
        for await (const tenant of user.tenants) {
          const tenantOption = await screen.findByRole('option', { name: tenant.name });
          expect(tenantOption).toBeInTheDocument();
          expect(tenantOption).toBeVisible();
        }
      });

      userEvent.click(profileImg);
      await waitFor(async () => expect(personal).not.toBeVisible());
    });

    test('Personal => Organization => Personal', async () => {
      const user = mockUsers[0];
      setupTaskPage(user);

      const organization = user.tenants[0];
      await changeWorkspace(user, organization.name);
      await waitForTasksToLoad(organization.tasks);

      await changeWorkspace(user, 'Personal');
      await waitForTasksToLoad(user.tasks);

      await changeWorkspace(user, organization.name);
      await waitForTasksToLoad(organization.tasks);

      // wait until last updates are done so they dont throw error when the test unmounts the components
      await new Promise(res => setTimeout(res, 1000));
    });
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

    test('clicking on the checkbox or the remove button doesnt open the edit panel', async () => {
      const user = mockUsers[0];
      setupTaskPage(user);
      const task = user.tasks[0];

      const noEditor = screen.queryByRole('complementary', { name: /edit panel/i });
      expect(noEditor).not.toBeInTheDocument();

      const taskSelectCh = await screen.findByTestId(`select-task-${task.id}`);
      userEvent.click(taskSelectCh);

      const noEditorAfterSelect = screen.queryByRole('complementary', { name: /edit panel/i });
      expect(noEditorAfterSelect).not.toBeInTheDocument();

      const taskRemoveBtn = await screen.findByTestId(`remove-task-${task.id}`);
      userEvent.click(taskRemoveBtn);

      const noEditorAfterRemove = screen.queryByRole('complementary', { name: /edit panel/i });
      expect(noEditorAfterRemove).not.toBeInTheDocument();
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

      describe('task status change', () => {
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

      describe.skip('assignee change', () => {
        const user = mockUsers[0];
        const otherUser = mockUsers[1];

        async function openTaskForEdit(task: Task) {
          const taskItem = screen.getByTestId(`task-item-${task.id}`);
          expect(taskItem).toBeVisible();

          userEvent.click(taskItem);
          await waitForMillis(1000);

          await waitFor(() => {
            const taskEditPanel = screen.getByRole('complementary', { name: /edit panel/i });
            expect(taskEditPanel).toBeVisible();
          });

          await waitFor(() => {
            const titleInput = screen.getByRole('textbox', { name: /title/i, hidden: false });
            expect(titleInput).toBeVisible();
          });
          // expect(titleInput).toHaveValue(task.title);
        }

        async function expectAssigneeToBe(username: string | RegExp) {
          await waitFor(() => {
            const assigneeSelect = screen.getByTestId(selectedItemId);
            expect(assigneeSelect).toHaveTextContent(username);
          });
        }

        async function changeAssignee(username: string | RegExp) {
          const assigneeSelect = screen.getByTestId(selectedItemId);
          expect(assigneeSelect).toBeVisible();

          userEvent.click(assigneeSelect);
          const userOption = screen.getByRole('option', { name: username });
          expect(userOption).toBeVisible();

          userEvent.click(userOption);
        }

        test('unassigned => assigned', async () => {
          // TODO: move this to end-to-end test because jest just cant handle this @adam.szi
          // expect(true).toBe(true);
          setupTaskPage(user);
          const organization = user.tenants[0];
          await changeWorkspace(user, organization.name);
          await waitForTasksToLoad(organization.tasks);

          const [task, otherTask] = organization.tasks;
          await openTaskForEdit(task);

          await expectAssigneeToBe(/unassigned/i);
          await changeAssignee(otherUser.data.username);
          await expectAssigneeToBe(otherUser.data.username);

          await openTaskForEdit(otherTask);

          await openTaskForEdit(task);
          await expectAssigneeToBe(otherUser.data.username);

          // wait until last updates are done so they dont throw error when the test unmounts the components
          await new Promise(res => setTimeout(res, 1000));
        });

        // test('assigned => assigned', async () => {
        //   const task = user.tenants[0].tasks[0];

        //   const taskItem = await screen.findByText(task.title);
        //   expect(taskItem).toBeInTheDocument();
        //   userEvent.click(taskItem);
        // });

        // test('assigned => unassigned', async () => {
        //   const task = user.tenants[0].tasks[0];

        //   const taskItem = await screen.findByText(task.title);
        //   expect(taskItem).toBeInTheDocument();
        //   userEvent.click(taskItem);
        // });
      });
    });

    it('deletes a task when the delete button is pressed on edit panel', async () => {
      const user = mockUsers[1];
      setupTaskPage(user);
      const task = user.tasks[0];

      const taskItem = await screen.findByText(task.title);
      userEvent.click(taskItem);

      const deleteBtn = screen.getByRole('button', { name: /delete task/i });
      expect(deleteBtn).toBeInTheDocument();

      userEvent.click(deleteBtn);
      await waitForElementToBeRemoved(() => screen.queryByTestId(`task-item-${task.id}`));

      const noEditorAfterSelect = screen.queryByRole('complementary', { name: /edit panel/i });
      expect(noEditorAfterSelect).not.toBeInTheDocument();

      // wait until last updates are done so they dont throw error when the test unmounts the components
      // await new Promise(res => setTimeout(res, 1000));
    });
  });
});
