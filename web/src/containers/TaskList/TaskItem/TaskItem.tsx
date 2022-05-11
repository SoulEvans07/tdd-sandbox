import { ReactElement } from 'react';
import { Checkbox } from '../../../components/control/Checkbox/Checkbox';
import { Task } from '../../../contexts/StoreContext';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

export function TaskItem(props: TaskItemProps): ReactElement {
  const { task } = props;
  const testId = `task-item-${task.id}`;
  return (
    <div className="task-item" id={testId} data-testid={testId}>
      <Checkbox />
      <span className="task-title">{task.title}</span>
    </div>
  );
}
