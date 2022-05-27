import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import './TaskEditPanel.scss';
import { Task, TaskStatus, TaskStatusNames, TaskStatusTransitions } from '../../contexts/store/types';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { SidePanel } from '../../components/layout/SidePanel/SidePanel';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';
import { Button, ButtonProps } from '../../components/control/Button/Button';

interface TaskEditPanelProps {
  task?: Task;
  onClose?: VoidFunction;
}

export function TaskEditPanel(props: TaskEditPanelProps): ReactElement {
  const { task, onClose } = props;

  const [status, setStatus] = useState<TaskStatus>('Todo');

  const transitions = useMemo((): ButtonProps[] => {
    return TaskStatusTransitions[status].map(option => ({
      children: TaskStatusNames[option],
      onClick: () => {},
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
          <Button fill={hasChanges ? 'fill' : 'border'} size="wide" color="primary" disabled={!hasChanges}>
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
