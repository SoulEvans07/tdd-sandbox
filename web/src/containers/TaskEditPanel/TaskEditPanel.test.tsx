import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { selectedItemId } from '../../components/control/FilterSelect/FilterSelect';
import { User } from '../../contexts/auth/AuthContext';
import { Task, TaskStatus, TaskStatusNames } from '../../contexts/store/types';
import { mockTenants, mockUsers } from '../../mocks/controllers/mockData';
import { TaskEditPanel } from './TaskEditPanel';

describe('TaskEditPanel', () => {
  const tenantUsers = mockUsers.filter(u => u.data.email.endsWith(mockTenants[0].name)).map(u => u.data);
  const testUser = tenantUsers[0];
  const otherUser = tenantUsers[1];

  const mockTaskBase: Task = {
    id: 0,
    title: 'Task 1',
    status: 'InProgress',
    description: 'Detailed description',
    order: 0,
  };

  const mockPersonalTask: Task = {
    ...mockTaskBase,
    tenantId: undefined,
    assigneeId: testUser.id,
  };

  const mockUnassignedTask: Task = {
    ...mockTaskBase,
    tenantId: testUser.tenants[0],
    assigneeId: undefined,
  };

  const mockAssignedTask: Task = {
    ...mockTaskBase,
    tenantId: testUser.tenants[0],
    assigneeId: otherUser.id,
  };

  interface MockTaskPageProps {
    open?: boolean;
    task: Task;
    isPersonal?: boolean;
    users?: User[];
    onSubmit?: (taskId: number, patch: Partial<Task>) => void;
    onDelete?: (taskId: number) => void;
  }

  function MockTaskPage(props: MockTaskPageProps) {
    const { open, task, isPersonal, users = [testUser], onSubmit = jest.fn(), onDelete = jest.fn() } = props;
    const [visible, setVisibility] = useState(!!open);

    const onOpen = () => setVisibility(true);
    const onClose = () => setVisibility(false);

    return (
      <>
        <button onClick={onOpen}>Open Task</button>
        <TaskEditPanel
          task={visible ? task : undefined}
          isPersonal={!!isPersonal}
          users={users}
          onClose={onClose}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </>
    );
  }
  const setupDefault = () => render(<MockTaskPage task={mockPersonalTask} open />);

  test('hidden until Task given to it', () => {
    render(<MockTaskPage task={mockPersonalTask} />);
    expect(screen.queryByText(mockPersonalTask.title)).not.toBeInTheDocument();

    const openBtn = screen.getByRole('button', { name: /open task/i });
    userEvent.click(openBtn);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
  });

  describe('panel composition', () => {
    test('title', () => {
      setupDefault();
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      expect(titleInput).toHaveValue(mockPersonalTask.title);
    });

    test('description', () => {
      setupDefault();
      const descriptionTA = screen.getByRole('textbox', { name: /description/i });
      expect(descriptionTA).toHaveValue(mockPersonalTask.description);
    });

    test('status label', () => {
      setupDefault();
      const statusLabel = screen.getByText(TaskStatusNames[mockPersonalTask.status]);
      expect(statusLabel).toBeInTheDocument();
    });

    describe.each<{ status: TaskStatus; options: TaskStatus[] }>([
      { status: 'Todo', options: ['InProgress'] },
      { status: 'InProgress', options: ['Blocked', 'Done'] },
      { status: 'Blocked', options: ['Todo', 'InProgress'] },
      { status: 'Done', options: [] },
    ])('transitions buttons', ({ status, options }) => {
      test(`${status} => ${!options.length ? '<None>' : options.join(', ')}`, () => {
        const task = { ...mockPersonalTask, status };
        render(<MockTaskPage task={task} open />);

        const statusLabel = screen.getByText(TaskStatusNames[status]);
        expect(statusLabel).toBeInTheDocument();

        options.forEach(opt => {
          const optionBtn = screen.getByRole('button', { name: TaskStatusNames[opt] });
          expect(optionBtn).toBeInTheDocument();
        });
      });
    });

    test('action buttons', () => {
      setupDefault();
      const deleteBtn = screen.getByRole('button', { name: /delete/i });
      expect(deleteBtn).toBeInTheDocument();

      const saveBtn = screen.getByRole('button', { name: /save/i });
      expect(saveBtn).toBeInTheDocument();
    });
  });

  describe('assignee', () => {
    describe('in personal workspace', () => {
      test('default task assignee', () => {
        render(<MockTaskPage task={mockPersonalTask} isPersonal open />);
        const assignee = screen.getByText(testUser.username);
        expect(assignee).toBeVisible();
      });

      test('cant change assignee', () => {
        render(<MockTaskPage task={mockPersonalTask} isPersonal open />);
        const assignee = screen.getByText(testUser.username);
        userEvent.click(assignee);

        expect(screen.queryByRole('option')).not.toBeInTheDocument();
      });
    });

    describe('in organization workspace', () => {
      test('task unassigned', () => {
        render(<MockTaskPage task={mockUnassignedTask} users={tenantUsers} open />);
        const assigneeSelector = screen.getByTestId(selectedItemId);
        expect(assigneeSelector).toBeInTheDocument();
        expect(assigneeSelector).toHaveTextContent(/unassigned/i);
      });

      test('task assigned', () => {
        render(<MockTaskPage task={mockAssignedTask} users={tenantUsers} open />);
        const assigneeSelector = screen.getByTestId(selectedItemId);
        expect(assigneeSelector).toBeInTheDocument();
        expect(assigneeSelector).toHaveTextContent(otherUser.username);
      });

      test('change assignee', () => {
        render(<MockTaskPage task={mockAssignedTask} users={tenantUsers} open />);
        const assigneeSelector = screen.getByTestId(selectedItemId);
        userEvent.click(assigneeSelector);

        const other = screen.getByRole('option', { name: otherUser.username });
        userEvent.click(other);

        expect(assigneeSelector).toHaveTextContent(otherUser.username);
      });
    });
  });

  describe('changing any value of the task makes the save button enabled', () => {
    let saveBtn: HTMLButtonElement;

    beforeEach(() => {
      render(<MockTaskPage task={mockPersonalTask} open />);
      saveBtn = screen.getByRole('button', { name: /save/i }) as HTMLButtonElement;
      expect(saveBtn).toBeDisabled();
    });

    function testInputField(input: HTMLElement) {
      userEvent.type(input, 'a');
      expect(saveBtn).toBeEnabled();

      userEvent.type(input, '{backspace}');
      expect(saveBtn).toBeDisabled();

      const count = 5;
      userEvent.type(input, 'b'.repeat(count));
      expect(saveBtn).toBeEnabled();

      userEvent.type(input, '{backspace}'.repeat(count));
      expect(saveBtn).toBeDisabled();
    }

    test('title', () => {
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      testInputField(titleInput);
    });

    test('description', () => {
      const descriptionTA = screen.getByRole('textbox', { name: /description/i });
      testInputField(descriptionTA);
    });
  });

  describe('submit interface', () => {
    const newTitle = 'New Task Title';
    const newDescription = 'Random detailed description';

    let saveBtn: HTMLButtonElement;
    const setupTest = (submit?: jest.Mock) => {
      render(<MockTaskPage task={mockPersonalTask} open onSubmit={submit} />);
      saveBtn = screen.getByRole('button', { name: /save/i }) as HTMLButtonElement;
    };

    test('title', () => {
      const submit = jest.fn();
      setupTest(submit);

      const titleInput = screen.getByRole('textbox', { name: /title/i });
      userEvent.clear(titleInput);
      userEvent.type(titleInput, newTitle);
      userEvent.click(saveBtn);

      expect(submit).toBeCalledWith(mockPersonalTask.id, { title: newTitle });
    });

    test('description', () => {
      const submit = jest.fn();
      setupTest(submit);

      const descriptionTA = screen.getByRole('textbox', { name: /description/i });
      userEvent.clear(descriptionTA);
      userEvent.type(descriptionTA, newDescription);
      userEvent.click(saveBtn);

      expect(submit).toBeCalledWith(mockPersonalTask.id, { description: newDescription });
    });

    test('title & description', () => {
      const submit = jest.fn();
      setupTest(submit);

      const titleInput = screen.getByRole('textbox', { name: /title/i });
      userEvent.clear(titleInput);
      userEvent.type(titleInput, newTitle);

      const descriptionTA = screen.getByRole('textbox', { name: /description/i });
      userEvent.clear(descriptionTA);
      userEvent.type(descriptionTA, newDescription);

      userEvent.click(saveBtn);

      expect(submit).toBeCalledWith(mockPersonalTask.id, { title: newTitle, description: newDescription });
    });

    describe.each<{ status: TaskStatus; options: TaskStatus[] }>([
      { status: 'Todo', options: ['InProgress'] },
      { status: 'InProgress', options: ['Blocked', 'Done'] },
      { status: 'Blocked', options: ['Todo', 'InProgress'] },
    ])('status transitions', ({ status, options }) => {
      test.each(options)(`${status} => %s`, async option => {
        const task = { ...mockPersonalTask, status };
        const submit = jest.fn();
        render(<MockTaskPage task={task} open onSubmit={submit} />);

        const nextStatusBtn = screen.getByRole('button', { name: TaskStatusNames[option] });
        userEvent.click(nextStatusBtn);

        const titleInput = screen.getByRole('textbox', { name: /title/i });
        userEvent.clear(titleInput);
        userEvent.type(titleInput, 'Ignored title');

        expect(submit).toBeCalledWith(task.id, { status: option });
      });
    });
  });

  test('delete interface', () => {
    const onDelete = jest.fn();
    render(<MockTaskPage task={mockPersonalTask} open onDelete={onDelete} />);

    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    userEvent.click(deleteBtn);

    expect(onDelete).toBeCalledWith(mockPersonalTask.id);
  });
});
