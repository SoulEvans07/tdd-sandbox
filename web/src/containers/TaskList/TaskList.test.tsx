import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList, TaskListProps } from './TaskList';

describe('TaskList', () => {
  it('shows an empty list message when there are no tasks', () => {
    render(<TaskList list={[]} onRemove={jest.fn()} />);
    const emptyListMsg = screen.getByText('There is nothing to do!');
    expect(emptyListMsg).toBeInTheDocument();
  });

  it('shows all task inside it', () => {
    const tasks: TaskListProps['list'] = Array(5)
      .fill(null)
      .map((_, i) => ({ id: i, title: `Task ${i}`, status: 'Todo' }));
    render(<TaskList list={tasks} onRemove={jest.fn()} />);

    tasks.forEach(task => {
      const taskItem = screen.getByText(task.title);
      expect(taskItem).toBeInTheDocument();
    });
  });

  it('calls the onRemove with the proper data when a remove button on a task is clicked', () => {
    const tasks: TaskListProps['list'] = Array(5)
      .fill(null)
      .map((_, i) => ({ id: i, title: `Task ${i}`, status: 'Todo' }));
    const handleRemove = jest.fn();
    render(<TaskList list={tasks} onRemove={handleRemove} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    userEvent.click(removeButtons[3]);
    expect(handleRemove).toBeCalled();
  });
});
