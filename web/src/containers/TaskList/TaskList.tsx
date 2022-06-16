import { ReactElement, useCallback, useMemo, useState } from 'react';
import produce from 'immer';
import { ArrayHelpers } from 'shared-utils';
import './TaskList.scss';
import { Task, TaskStatus } from '../../contexts/store/types';
import { TaskItem } from './TaskItem/TaskItem';
import { Button } from '../../components/control/Button/Button';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';

export interface TaskListProps {
  list: Task[];
  onRemove: (taskIds: Array<Task['id']>) => void;
  onEdit: (selectedId: Task['id']) => void;
}

export function TaskList(props: TaskListProps): ReactElement {
  const { list, onRemove, onEdit } = props;
  const [filter, setFilter] = useState<TaskStatus | undefined>(undefined);

  const changeFilterTo = (filter?: TaskStatus) => () => setFilter(filter);

  const buttons = useMemo(() => {
    return [
      { children: 'All', active: filter === undefined, onClick: changeFilterTo() },
      { children: 'Open', active: filter === 'Todo', onClick: changeFilterTo('Todo') },
      { children: 'In Progress', active: filter === 'InProgress', onClick: changeFilterTo('InProgress') },
      { children: 'Blocked', active: filter === 'Blocked', onClick: changeFilterTo('Blocked') },
      { children: 'Done', active: filter === 'Done', onClick: changeFilterTo('Done') },
    ];
  }, [filter]);

  const completedTaskIds = useMemo(() => list.filter(t => t.status === 'Done').map(t => t.id), [list]);
  const [filteredList, filteredIdList] = useMemo(
    () => ArrayHelpers.filterPickBy(list, 'id', 'status', filter),
    [list, filter]
  );

  const [selectedTasks, setSelected] = useState<Record<Task['id'], boolean>>({});
  const onTaskSelect = (id: Task['id']) => (selected: boolean) =>
    setSelected(prev =>
      produce(prev, draft => {
        draft[id] = selected;
      })
    );

  const currentSelection = useMemo(() => {
    const curr = Object.entries(selectedTasks).reduce((acc: number[], [id, sel]) => {
      const taskId = Number(id);
      if (sel && filteredIdList.includes(taskId)) acc.push(taskId);
      return acc;
    }, []);
    return curr;
  }, [selectedTasks, filteredIdList]);

  const hasSelection = useMemo(() => currentSelection.some(t => t), [currentSelection]);
  const isClearDisabled = useMemo(
    () => !hasSelection && completedTaskIds.length === 0,
    [hasSelection, completedTaskIds]
  );

  const handleClear = useCallback(() => {
    if (!hasSelection) onRemove(completedTaskIds);
    else onRemove(currentSelection);
  }, [hasSelection, completedTaskIds, currentSelection]);

  return (
    <section className="task-list-container">
      <section className="controls">
        <div className="button-group text filter">
          <ButtonGroup fill="text" size="small" buttons={buttons} />
        </div>
        <Button fill="text" size="small" className="clear-btn" onClick={handleClear} disabled={isClearDisabled}>
          {hasSelection ? 'Clear Selected' : 'Clear Completed'}
        </Button>
      </section>
      <section className="task-list">
        {filteredList.length === 0 && <div className="empty-list">There is nothing here!</div>}
        {filteredList.map(task => (
          <TaskItem
            task={task}
            key={`task-${task.id}`}
            onRemove={() => onRemove([task.id])}
            selected={!!selectedTasks[task.id]}
            onSelect={onTaskSelect(task.id)}
            onEdit={() => onEdit(task.id)}
          />
        ))}
      </section>
    </section>
  );
}
