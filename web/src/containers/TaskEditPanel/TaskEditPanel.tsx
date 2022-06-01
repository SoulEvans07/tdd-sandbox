import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import './TaskEditPanel.scss';
import { Task, TaskStatus, TaskStatusColors, TaskStatusNames, TaskStatusTransitions } from '../../contexts/store/types';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { SidePanel } from '../../components/layout/SidePanel/SidePanel';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';
import { Button, ButtonProps } from '../../components/control/Button/Button';
import { TagLabel } from '../../components/ui/TagLabel/TagLabel';
import { RestrictedUserDTO } from '../../controllers/UserController';
import { NameTag } from '../../components/ui/NameTag/NameTag';

interface TaskEditPanelProps {
  task?: Task;
  users: RestrictedUserDTO[];
  onClose: VoidFunction;
  onSubmit: (taskId: number, patch: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
}

export function TaskEditPanel(props: TaskEditPanelProps): ReactElement {
  const { task, users, onClose, onSubmit, onDelete } = props;

  const [assignee, setAssignee] = useState<RestrictedUserDTO | undefined>(undefined);
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
  }, [status, task]);

  const [title, setTitle] = useState('');
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const [description, setDescription] = useState('');
  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    setDirty(false);
    if (task) {
      setStatus(task.status);
      setTitle(task.title);
      setDescription(task.description);

      if (task.assigneeId == null) setAssignee(undefined);
      else setAssignee(users.find(u => u.id === task.assigneeId));
    }
  }, [task, users]);

  useEffect(() => {
    if (!task) setDirty(false);
    else setDirty(task.title !== title || task.description !== description);
  }, [status, title, description]);

  const handleSubmit = () => {
    if (!task) return;

    const patch: Partial<Task> = {};
    if (title !== task.title) patch.title = title;
    if (description !== task.description) patch.description = description;

    if (Object.keys(patch).length > 0) onSubmit(task.id, patch);
  };

  const handleDelete = () => {
    if (!task) return;
    onDelete(task.id);
  };

  return (
    <SidePanel className="task-edit-panel right" hidden={!task} onClose={onClose} label="Edit Panel">
      <section className="task-details">
        <div className="assignee-row">
          <NameTag name={assignee?.username} />
        </div>
        <div className="status-row">
          <TagLabel className="status-label" name={TaskStatusNames[status]} color={TaskStatusColors[status]} />
          <ButtonGroup buttons={transitions} fill="border" />
        </div>
        <TextInput title="Title" className="task-title" value={title} onChange={onTitleChange} />
        <textarea title="Description" className="task-description" value={description} onChange={onDescriptionChange} />
        <div className="action-row">
          <Button fill={dirty ? 'fill' : 'border'} size="wide" color="primary" disabled={!dirty} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button fill="border" size="wide" color="error" onClick={handleDelete}>
            Delete Task
          </Button>
        </div>
      </section>
    </SidePanel>
  );
}
