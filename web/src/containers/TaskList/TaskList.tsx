import { ReactElement } from 'react';
import './TaskList.scss';
import { Task } from '../../contexts/StoreContext';
import { TaskItem } from './TaskItem/TaskItem';
import { Button } from '../../components/control/Button/Button';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';

interface TaskListProps {
  list: Task[];
}

export function TaskList(props: TaskListProps): ReactElement {
  const { list } = props;

  return (
    <section className="task-list-container">
      <section className="controls">
        <div className="button-group text filter">
          <ButtonGroup
            fill="text"
            size="small"
            buttons={[
              { children: 'All', active: true },
              { children: 'Open' },
              { children: 'In Progress' },
              { children: 'Blocked' },
              { children: 'Done' },
            ]}
          />
        </div>
        <Button fill="text" size="small" className="clear-btn">
          Clear Selected
        </Button>
      </section>
      <section className="task-list">
        {list.length === 0 && <div className="empty-list">There is nothing to do!</div>}
        {list.map(task => (
          <TaskItem task={task} key={task.id} />
        ))}
      </section>
    </section>
  );
}
