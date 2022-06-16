import { ReactElement } from 'react';
import { stopPropagation } from 'shared-utils';
import './TaskItem.scss';
import { Checkbox } from '../../../components/control/Checkbox/Checkbox';
import { Icon } from '../../../components/ui/Icon/Icon';
import { TagLabel } from '../../../components/ui/TagLabel/TagLabel';
import { Task, TaskStatusColors, TaskStatusNames } from '../../../contexts/store/types';

export interface TaskItemProps {
  task: Task;
  onRemove: VoidFunction;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
}

export function TaskItem(props: TaskItemProps): ReactElement {
  const { task, onRemove, selected, onSelect, onEdit } = props;
  const testId = `task-item-${task.id}`;

  return (
    <div className="task-item" id={testId} data-testid={testId} onClick={onEdit}>
      <Checkbox title="Select" checked={selected} onChange={onSelect} data-testid={`select-task-${task.id}`} />
      <span className="task-title">{task.title}</span>
      {task.status !== 'Todo' && (
        <TagLabel className="status-label" name={TaskStatusNames[task.status]} color={TaskStatusColors[task.status]} />
      )}
      <Icon
        className="remove-task"
        icon="cross"
        onClick={stopPropagation(onRemove)}
        role="button"
        aria-label="Remove"
        data-testid={`remove-task-${task.id}`}
      />
    </div>
  );
}
