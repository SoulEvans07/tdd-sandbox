import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList, TaskListProps } from './TaskList';

describe('TaskList', () => {
  const tasks: TaskListProps['list'] = [
    { id: 0, order: 0, title: 'Open Task 1', description: '', status: 'Todo' },
    { id: 1, order: 1, title: 'Open Task 2', description: '', status: 'Todo' },
    { id: 2, order: 2, title: 'Done Task 1', description: '', status: 'Done' },
    { id: 3, order: 3, title: 'WIP Task 1', description: '', status: 'InProgress' },
    { id: 4, order: 4, title: 'WIP Task 2', description: '', status: 'InProgress' },
    { id: 5, order: 5, title: 'Blocked Task 1', description: '', status: 'Blocked' },
    { id: 6, order: 6, title: 'WIP Task 3', description: '', status: 'InProgress' },
    { id: 7, order: 7, title: 'Open Task 3', description: '', status: 'Todo' },
    { id: 8, order: 8, title: 'Done Task 2', description: '', status: 'Done' },
    { id: 9, order: 9, title: 'Done Task 3', description: '', status: 'Done' },
  ];

  function setupTaskList(tasks: TaskListProps['list'], props?: Partial<Omit<TaskListProps, 'list'>>) {
    render(<TaskList list={tasks} onRemove={jest.fn()} onEdit={jest.fn()} {...props} />);
  }

  it('shows an empty list message when there are no tasks', () => {
    setupTaskList([]);

    const emptyListMsg = screen.getByText('There is nothing here!');
    expect(emptyListMsg).toBeInTheDocument();
  });

  it('shows all task inside it', () => {
    setupTaskList(tasks);

    tasks.forEach(task => {
      const taskItem = screen.getByText(task.title);
      expect(taskItem).toBeInTheDocument();
    });
  });

  it('calls the onRemove with the proper data when a remove button on a task is clicked', () => {
    const handleRemove = jest.fn();
    setupTaskList(tasks, { onRemove: handleRemove });

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    userEvent.click(removeButtons[3]);
    expect(handleRemove).toBeCalled();
  });

  test('filter All is selected at start', () => {
    setupTaskList([]);

    const allFilter = screen.getByRole('button', { name: /all/i });
    expect(allFilter).toBeInTheDocument();
    expect(allFilter).toHaveClass('active');
  });

  it('shows an empty list message when there are no tasks by the selected filter', () => {
    const tasks = [{ id: 0, order: 0, title: 'Blocked Task 1', description: '', status: 'Blocked' as const }];
    setupTaskList(tasks);

    const noEmptyMsg = screen.queryByText('There is nothing here!');
    expect(noEmptyMsg).not.toBeInTheDocument();

    const openFilter = screen.getByRole('button', { name: /open/i });
    userEvent.click(openFilter);

    const emptyListMsg = screen.getByText('There is nothing here!');
    expect(emptyListMsg).toBeInTheDocument();
  });

  function checkByStatus(status?: TaskListProps['list'][number]['status']) {
    return (task: TaskListProps['list'][number]) => {
      const shouldBeVisible = !status || task.status === status;
      if (shouldBeVisible) expect(screen.getByText(task.title)).toBeInTheDocument();
      else expect(screen.queryByText(task.title)).not.toBeInTheDocument();
    };
  }

  describe.each([
    { title: 'All', selector: /all/i, status: undefined },
    { title: 'Open', selector: /open/i, status: 'Todo' as const },
    { title: 'In Progress', selector: /in progress/i, status: 'InProgress' as const },
    { title: 'Blocked', selector: /blocked/i, status: 'Blocked' as const },
    { title: 'Done', selector: /done/i, status: 'Done' as const },
  ])('should filter tasks based on the selected filter button', ({ title, selector, status }) => {
    test(`${title} filter`, () => {
      const handleRemove = jest.fn();
      setupTaskList(tasks, { onRemove: handleRemove });

      const filter = screen.getByRole('button', { name: selector });
      expect(filter).toBeInTheDocument();
      userEvent.click(filter);
      tasks.forEach(checkByStatus(status));
    });
  });

  describe('multi select delete', () => {
    test('clear completed btn is visible, when there are no selected items', () => {
      const handleRemove = jest.fn();
      setupTaskList(tasks, { onRemove: handleRemove });

      const clearCompleted = screen.getByRole('button', { name: /clear completed/i });
      expect(clearCompleted).toBeInTheDocument();

      selectTaskItems([2, 1, 5]);

      const noClearSelected = screen.queryByRole('button', { name: /clear completed/i });
      expect(noClearSelected).not.toBeInTheDocument();

      selectTaskItems([2, 1, 5]);

      const clearCompletedAgain = screen.getByRole('button', { name: /clear completed/i });
      expect(clearCompletedAgain).toBeInTheDocument();
    });

    test('pressing clear completed will call onRemove with the completed items', () => {
      const handleRemove = jest.fn();
      setupTaskList(tasks, { onRemove: handleRemove });

      const clearCompleted = screen.getByRole('button', { name: /clear completed/i });
      userEvent.click(clearCompleted);
      expect(handleRemove).toBeCalledWith(tasks.filter(t => t.status === 'Done').map(t => t.id));
    });

    describe.each([
      { title: 'there are no completed tasks in the list', currentTasks: tasks.filter(t => t.status !== 'Done') },
      { title: 'there are no tasks in the list', currentTasks: [] },
    ])('clear completed btn is disabled', ({ title, currentTasks }) => {
      test(`when ${title}`, () => {
        const handleRemove = jest.fn();
        setupTaskList(currentTasks, { onRemove: handleRemove });

        const clearCompleted = screen.getByRole('button', { name: /clear completed/i });
        expect(clearCompleted).toBeDisabled();
      });
    });

    function selectTaskItems(toSelect: number[]) {
      const checkboxes = screen.getAllByRole('checkbox', { name: /select/i });
      toSelect.forEach(index => userEvent.click(checkboxes[index]));
    }

    test('clear selected btn only visible there are selected items', () => {
      const handleRemove = jest.fn();
      setupTaskList(tasks, { onRemove: handleRemove });

      const noClearSelected = screen.queryByRole('button', { name: /clear selected/i });
      expect(noClearSelected).not.toBeInTheDocument();

      selectTaskItems([2, 1, 5]);

      const clearSelected = screen.getByRole('button', { name: /clear selected/i });
      expect(clearSelected).toBeInTheDocument();

      selectTaskItems([2, 1, 5]);

      const noClearSelectedAgain = screen.queryByRole('button', { name: /clear selected/i });
      expect(noClearSelectedAgain).not.toBeInTheDocument();
    });

    test('clear selected will call onRemove with the selected task ids', () => {
      const handleRemove = jest.fn();
      setupTaskList(tasks, { onRemove: handleRemove });

      const toRemove = [2, 1, 5];
      selectTaskItems(toRemove);
      const clearSelected = screen.getByRole('button', { name: /clear selected/i });
      userEvent.click(clearSelected);
      expect(handleRemove).toBeCalledWith(expect.arrayContaining(toRemove));
    });

    test('clear selected will only remove filtered/visible tasks', async () => {
      const handleRemove = jest.fn();
      setupTaskList(tasks, { onRemove: handleRemove });

      const openTasksToSelect = [1, 7];
      const otherTasksToSelect = [2, 6];
      const toSelect = [...otherTasksToSelect, ...openTasksToSelect];
      selectTaskItems(toSelect);

      const openFilter = screen.getByRole('button', { name: /open/i });
      userEvent.click(openFilter);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);

      const clearSelected = screen.getByRole('button', { name: /clear selected/i });
      userEvent.click(clearSelected);

      expect(handleRemove).toHaveBeenLastCalledWith(expect.arrayContaining(openTasksToSelect));
      expect(handleRemove).not.toHaveBeenLastCalledWith(expect.arrayContaining(otherTasksToSelect));
    });
  });
});
