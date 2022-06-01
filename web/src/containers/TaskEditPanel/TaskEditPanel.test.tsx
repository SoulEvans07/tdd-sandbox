import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Task, TaskStatus, TaskStatusNames } from '../../contexts/store/types';
import { TaskEditPanel } from './TaskEditPanel';

describe('TaskEditPanel', () => {
  const mockTask: Task = {
    id: 0,
    title: 'Task 1',
    status: 'InProgress',
    description: 'Detailed description',
    order: 0,
  };

  interface MockTaskPageProps {
    open?: boolean;
    task: Task;
    onSubmit?: (taskId: number, patch: Partial<Task>) => void;
    onDelete?: (taskId: number) => void;
  }

  function MockTaskPage(props: MockTaskPageProps) {
    const { open, task, onSubmit = jest.fn(), onDelete = jest.fn() } = props;
    const [visible, setVisibility] = useState(!!open);

    const onOpen = () => setVisibility(true);
    const onClose = () => setVisibility(false);

    return (
      <>
        <button onClick={onOpen}>Open Task</button>
        <TaskEditPanel task={visible ? task : undefined} onClose={onClose} onSubmit={onSubmit} onDelete={onDelete} />
      </>
    );
  }

  test('hidden until Task given to it', () => {
    render(<MockTaskPage task={mockTask} />);
    expect(screen.queryByText(mockTask.title)).not.toBeInTheDocument();

    const openBtn = screen.getByRole('button', { name: /open task/i });
    userEvent.click(openBtn);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
  });

  describe('panel composition', () => {
    const setup = () => render(<MockTaskPage task={mockTask} open />);

    test('title', () => {
      setup();
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      expect(titleInput).toHaveValue(mockTask.title);
    });

    test('description', () => {
      setup();
      const descriptionTA = screen.getByRole('textbox', { name: /description/i });
      expect(descriptionTA).toHaveValue(mockTask.description);
    });

    test('status label', () => {
      setup();
      const statusLabel = screen.getByText(TaskStatusNames[mockTask.status]);
      expect(statusLabel).toBeInTheDocument();
    });

    describe.each<{ status: TaskStatus; options: TaskStatus[] }>([
      { status: 'Todo', options: ['InProgress'] },
      { status: 'InProgress', options: ['Blocked', 'Done'] },
      { status: 'Blocked', options: ['Todo', 'InProgress'] },
      { status: 'Done', options: [] },
    ])('transitions buttons', ({ status, options }) => {
      test(`${status} => ${!options.length ? '<None>' : options.join(', ')}`, () => {
        const task = { ...mockTask, status };
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
      setup();
      const deleteBtn = screen.getByRole('button', { name: /delete/i });
      expect(deleteBtn).toBeInTheDocument();

      const saveBtn = screen.getByRole('button', { name: /save/i });
      expect(saveBtn).toBeInTheDocument();
    });
  });

  describe('changing any value of the task makes the save button enabled', () => {
    let saveBtn: HTMLButtonElement;

    beforeEach(() => {
      render(<MockTaskPage task={mockTask} open />);
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
      render(<MockTaskPage task={mockTask} open onSubmit={submit} />);
      saveBtn = screen.getByRole('button', { name: /save/i }) as HTMLButtonElement;
    };

    test('title', () => {
      const submit = jest.fn();
      setupTest(submit);

      const titleInput = screen.getByRole('textbox', { name: /title/i });
      userEvent.clear(titleInput);
      userEvent.type(titleInput, newTitle);
      userEvent.click(saveBtn);

      expect(submit).toBeCalledWith(mockTask.id, { title: newTitle });
    });

    test('description', () => {
      const submit = jest.fn();
      setupTest(submit);

      const descriptionTA = screen.getByRole('textbox', { name: /description/i });
      userEvent.clear(descriptionTA);
      userEvent.type(descriptionTA, newDescription);
      userEvent.click(saveBtn);

      expect(submit).toBeCalledWith(mockTask.id, { description: newDescription });
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

      expect(submit).toBeCalledWith(mockTask.id, { title: newTitle, description: newDescription });
    });

    describe.each<{ status: TaskStatus; options: TaskStatus[] }>([
      { status: 'Todo', options: ['InProgress'] },
      { status: 'InProgress', options: ['Blocked', 'Done'] },
      { status: 'Blocked', options: ['Todo', 'InProgress'] },
    ])('status transitions', ({ status, options }) => {
      test.each(options)(`${status} => %s`, async option => {
        const task = { ...mockTask, status };
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
    render(<MockTaskPage task={mockTask} open onDelete={onDelete} />);

    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    userEvent.click(deleteBtn);

    expect(onDelete).toBeCalledWith(mockTask.id);
  });
});
