import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import './TaskEditPanel.scss';
import { Task, TaskStatus, TaskStatusNames, TaskStatusTransitions } from '../../contexts/store/types';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { SidePanel } from '../../components/layout/SidePanel/SidePanel';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';
import { Button, ButtonProps } from '../../components/control/Button/Button';

interface TaskEditPanelProps {
  task?: Task;
  onClose: VoidFunction;
  onSubmit: (taskId: number, patch: Partial<Task>) => void;
}

export function TaskEditPanel(props: TaskEditPanelProps): ReactElement {
  const { task, onClose, onSubmit } = props;

  const [status, setStatus] = useState<TaskStatus>('Todo');

  const handleStatusChange = (status: TaskStatus) => {
    if (!task) return;
    onSubmit(task.id, { status });
  };

  const transitions = useMemo((): ButtonProps[] => {
    return TaskStatusTransitions[status].map(option => ({
      children: TaskStatusNames[option],
      onClick: () => handleStatusChange(option),
    }));
  }, [status]);

  const [title, setTitle] = useState('');
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const [description, setDescription] = useState('');
  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const hasChanges = useMemo(() => {
    return task?.title !== title || task.description !== description;
  }, [status, title, description, task]);

  const handleSubmit = () => {
    if (!task) return;

    const patch: Partial<Task> = {};
    if (title !== task.title) patch.title = title;
    if (description !== task.description) patch.description = description;

    if (Object.keys(patch).length > 0) onSubmit(task.id, patch);
  };

  return (
    <SidePanel className="task-edit-panel right" hidden={!task} onClose={onClose} label="Edit Panel">
      <section className="task-details">
        <div className="assignee-row"></div>
        <div className="status-row">
          <span className="status-label in-progress">{TaskStatusNames[status]}</span>
          <ButtonGroup buttons={transitions} fill="border" />
        </div>
        <TextInput title="Title" className="task-title" value={title} onChange={onTitleChange} />
        <textarea title="Description" className="task-description" value={description} onChange={onDescriptionChange} />
        <div className="action-row">
          <Button
            fill={hasChanges ? 'fill' : 'border'}
            size="wide"
            color="primary"
            disabled={!hasChanges}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
          <Button fill="border" size="wide" color="error">
            Delete Task
          </Button>
        </div>
      </section>
    </SidePanel>
  );
}
