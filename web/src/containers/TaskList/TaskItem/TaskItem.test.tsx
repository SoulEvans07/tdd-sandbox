import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement, useState } from 'react';
import { TaskStatus, TaskStatusNames } from '../../../contexts/store/types';
import { TaskItem, TaskItemProps } from './TaskItem';

interface MockTaskItemProps {
  task: TaskItemProps['task'];
  spyFn: ReturnType<typeof jest.fn>;
}

function MockControlledTaskItem({ task, spyFn }: MockTaskItemProps): ReactElement {
  const [selected, setSelected] = useState(false);
  const handleSelect = (s: boolean) => {
    spyFn(s);
    setSelected(s);
  };
  return <TaskItem task={task} onRemove={jest.fn()} selected={selected} onSelect={handleSelect} onEdit={jest.fn()} />;
}

describe('TaskItem', () => {
  const selectHandler = jest.fn();
  const removeHandler = jest.fn();
  const mockTask: TaskItemProps['task'] = {
    id: 0,
    title: 'Test task item',
    status: 'Todo',
    description: 'Simple description',
    order: 0,
  };

  it('shows the title', () => {
    render(
      <TaskItem task={mockTask} onRemove={removeHandler} selected={false} onSelect={selectHandler} onEdit={jest.fn()} />
    );
    const title = screen.getByText(mockTask.title);
    expect(title).toBeInTheDocument();
  });

  it('has a remove button', () => {
    render(
      <TaskItem task={mockTask} onRemove={removeHandler} selected={false} onSelect={selectHandler} onEdit={jest.fn()} />
    );
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    userEvent.click(removeBtn);
    expect(removeHandler).toBeCalled();
  });

  it('has a select checkbox', () => {
    const spyOnSelect = jest.fn();
    render(<MockControlledTaskItem task={mockTask} spyFn={spyOnSelect} />);
    const selectCh = screen.getByRole('checkbox', { name: /select/i });
    expect(selectCh).not.toBeChecked();

    userEvent.click(selectCh);
    expect(selectCh).toBeChecked();
    expect(spyOnSelect).toBeCalledWith(true);

    userEvent.click(selectCh);
    expect(selectCh).not.toBeChecked();
    expect(spyOnSelect).toBeCalledWith(false);
  });

  function testLabelVisibility(status: TaskStatus) {
    const statusLabel = screen.getByText(TaskStatusNames[status]);
    expect(statusLabel).toBeVisible();
  }

  function testLabelInvisibility(status: TaskStatus) {
    const statusLabel = screen.queryByText(TaskStatusNames[status]);
    expect(statusLabel).not.toBeInTheDocument();
  }

  describe.each<{ status: TaskStatus; hasLabel: boolean }>([
    { status: 'Todo', hasLabel: false },
    { status: 'InProgress', hasLabel: true },
    { status: 'Blocked', hasLabel: true },
    { status: 'Done', hasLabel: true },
  ])('status transitions', ({ status, hasLabel }) => {
    test(`${status} label is ${hasLabel ? '' : 'NOT '}visible`, () => {
      const task = { ...mockTask, status };
      render(
        <TaskItem task={task} onRemove={removeHandler} selected={false} onSelect={selectHandler} onEdit={jest.fn()} />
      );

      if (hasLabel) testLabelVisibility(status);
      else testLabelInvisibility(status);
    });
  });
});
