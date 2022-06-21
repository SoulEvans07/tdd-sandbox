import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { RestrictedUserDTO } from '@tdd-sandbox/api-managers';
import './TaskEditPanel.scss';
import { Task, TaskStatus, TaskStatusColors, TaskStatusNames, TaskStatusTransitions } from '../../contexts/store/types';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { SidePanel } from '../../components/layout/SidePanel/SidePanel';
import { ButtonGroup } from '../../components/control/ButtonGroup/ButtonGroup';
import { Button, ButtonProps } from '../../components/control/Button/Button';
import { TagLabel } from '../../components/ui/TagLabel/TagLabel';
import { NameTag } from '../../components/ui/NameTag/NameTag';
import { FilterSelect } from '../../components/control/FilterSelect/FilterSelect';
import { SelectOption } from '../../components/control/FilterSelect/SelectOption';

interface TaskEditPanelProps {
  task?: Task;
  isPersonal: boolean;
  users: RestrictedUserDTO[];
  onClose: VoidFunction;
  onSubmit: (taskId: number, patch: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
}

export function TaskEditPanel(props: TaskEditPanelProps): ReactElement {
  const { task, isPersonal, users, onClose, onSubmit, onDelete } = props;

  const [selectOpen, setSelectOpen] = useState(false);
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

  const handleAssigneeChange = (username?: string) => {
    setSelectOpen(false);
    if (!task) return;
    const assigneeUser = users.find(u => u.username === username);
    if (assigneeUser) onSubmit(task.id, { assigneeId: assigneeUser.id });
  };

  return (
    <SidePanel className="task-edit-panel right" hidden={!task} onClose={onClose} label="Edit Panel">
      <section className="task-details">
        <div className="assignee-row">
          {isPersonal && !!assignee && <NameTag name={assignee.username} />}
          {!isPersonal && (
            <FilterSelect
              open={selectOpen}
              onOpen={() => setSelectOpen(true)}
              onChange={handleAssigneeChange}
              initial={assignee?.username || 'unassigned'}
              placeholder="Assignee..."
            >
              <SelectOption value="unassigned">
                <NameTag name="Unassigned" img="img/default-avatar.png" />
              </SelectOption>
              {users.map(user => (
                <SelectOption key={user.id} value={user.username}>
                  <NameTag name={user.username} />
                </SelectOption>
              ))}
            </FilterSelect>
          )}
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
