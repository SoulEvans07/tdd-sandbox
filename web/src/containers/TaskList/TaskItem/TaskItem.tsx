import { ReactElement } from 'react';
import { Checkbox } from '../../../components/control/Checkbox/Checkbox';
import { Icon } from '../../../components/ui/Icon/Icon';
import { Task } from '../../../contexts/store/types';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onRemove: VoidFunction;
}

export function TaskItem(props: TaskItemProps): ReactElement {
  const { task, onRemove } = props;
  const testId = `task-item-${task.id}`;

  return (
    <div className="task-item" id={testId} data-testid={testId}>
      <Checkbox />
      <span className="task-title">{task.title}</span>
      <Icon className="remove-task" icon="cross" onClick={onRemove} role="button" aria-label="remove-task" />
    </div>
  );
}
