import { ReactElement, useMemo, useState } from 'react';
import './TaskList.scss';
import { Task, TaskStatus } from '../../contexts/store/types';
import { TaskItem } from './TaskItem/TaskItem';
import { Button } from '../../components/control/Button/Button';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';

export interface TaskListProps {
  list: Task[];
  onRemove: (task: Task) => void;
}

export function TaskList(props: TaskListProps): ReactElement {
  const { list, onRemove } = props;
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

  const filteredList = useMemo(() => {
    return list.filter(task => !filter || task.status === filter);
  }, [filter, list]);

  return (
    <section className="task-list-container">
      <section className="controls">
        <div className="button-group text filter">
          <ButtonGroup fill="text" size="small" buttons={buttons} />
        </div>
        <Button fill="text" size="small" className="clear-btn">
          Clear Selected
        </Button>
      </section>
      <section className="task-list">
        {filteredList.length === 0 && <div className="empty-list">There is nothing here!</div>}
        {filteredList.map(task => (
          <TaskItem task={task} key={`task-${task.id}`} onRemove={() => onRemove(task)} />
        ))}
      </section>
    </section>
  );
}
