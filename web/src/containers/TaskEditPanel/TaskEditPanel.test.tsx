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
  }

  function MockTaskPage(props: MockTaskPageProps) {
    const { open, task, onSubmit = jest.fn() } = props;
    const [visible, setVisibility] = useState(!!open);

    const onOpen = () => setVisibility(true);
    const onClose = () => setVisibility(false);

    return (
      <>
        <button onClick={onOpen}>Open Task</button>
        <TaskEditPanel task={visible ? task : undefined} onClose={onClose} onSubmit={onSubmit} />
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

  test('panel composition', () => {
    render(<MockTaskPage task={mockTask} open />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    expect(titleInput).toHaveValue(mockTask.title);

    const descriptionTA = screen.getByRole('textbox', { name: /description/i });
    expect(descriptionTA).toHaveValue(mockTask.description);

    const statusLabel = screen.getByText(TaskStatusNames[mockTask.status]);
    expect(statusLabel).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    expect(deleteBtn).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeInTheDocument();
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

  describe.each<{ status: TaskStatus; options: TaskStatus[] }>([
    { status: 'Todo', options: ['InProgress'] },
    { status: 'InProgress', options: ['Blocked', 'Done'] },
    { status: 'Blocked', options: ['Todo', 'InProgress'] },
    { status: 'Done', options: [] },
  ])('transitions', ({ status, options }) => {
    test(`${status} => ${!options.length ? '<None>' : options.join(', ')}`, () => {
      const task = { ...mockTask, status: status };
      render(<MockTaskPage task={task} open />);

      const statusLabel = screen.getByText(TaskStatusNames[status]);
      expect(statusLabel).toBeInTheDocument();

      options.forEach(opt => {
        const optionBtn = screen.getByRole('button', { name: TaskStatusNames[opt] });
        expect(optionBtn).toBeInTheDocument();
      });
    });
  });
});
