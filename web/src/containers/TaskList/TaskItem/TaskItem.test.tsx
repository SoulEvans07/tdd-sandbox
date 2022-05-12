import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem, TaskItemProps } from './TaskItem';

describe('TaskItem', () => {
  const removeHandler = jest.fn();
  const task: TaskItemProps['task'] = {
    id: 0,
    title: 'Test task item',
    status: 'Todo',
  };

  beforeEach(() => {
    render(<TaskItem task={task} onRemove={removeHandler} />);
  });

  it('shows the title', () => {
    const title = screen.getByText(task.title);
    expect(title).toBeInTheDocument();
  });

  it('has a remove button', () => {
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    userEvent.click(removeBtn);
    expect(removeHandler).toBeCalled();
  });
});
