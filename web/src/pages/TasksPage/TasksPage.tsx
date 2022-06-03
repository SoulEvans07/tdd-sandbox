import { ChangeEvent, KeyboardEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { Checkbox } from '../../components/control/Checkbox/Checkbox';
import { TaskList } from '../../containers/TaskList/TaskList';
import { useDispatch, useSelector } from '../../contexts/store/StoreContext';
import { selectActiveWorkspace, selectWorkspaceTasks } from '../../contexts/store/selectors';
import { Task } from '../../contexts/store/types';
import { createTask, loadTasks, removeMultipleTask, updateTask } from '../../contexts/store/actions';
import { taskController } from '../../controllers/TaskController';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Footer } from '../../components/layout/Footer/Footer';
import { TaskEditPanel } from '../../containers/TaskEditPanel/TaskEditPanel';
import { RestrictedUserDTO, userController } from '../../controllers/UserController';

export function TasksPage(): ReactElement {
  const dispatch = useDispatch();
  const { currentUser, token } = useAuth();
  const { workspace: activeWs, isPersonal } = useSelector(selectActiveWorkspace);
  const tasks = useSelector(selectWorkspaceTasks);
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckAll = (checked: boolean) => setCheckAll(checked);

  const [users, setUsers] = useState<RestrictedUserDTO[]>();
  useEffect(() => {
    if (currentUser && token) {
      taskController
        .list(token, isPersonal ? undefined : Number(activeWs.id))
        .then(list => dispatch(loadTasks(list, activeWs.id)));

      if (isPersonal) setUsers([currentUser]);
      else userController.list(Number(activeWs.id), token).then(list => setUsers(list));
    }
  }, [activeWs.id, isPersonal]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value);
  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!!newTaskTitle && e.key === 'Enter') handleCreate();
  };

  const handleCreate = () => {
    if (!token) return;
    taskController
      .create({ title: newTaskTitle, tenantId: isPersonal ? undefined : Number(activeWs.id) }, token)
      .then(newTask => dispatch(createTask(newTask)));
    setNewTaskTitle('');
  };

  const handleRemove = (taskIds: Array<Task['id']>) => {
    if (!token) return;
    taskController.remove(taskIds, token).then(() => dispatch(removeMultipleTask(taskIds)));
  };

  const [editTaskId, setEditedTask] = useState<Task['id'] | null>(null);
  const handleOpenEdit = (taskId: Task['id']) => setEditedTask(taskId);
  const handleCloseEdit = () => setEditedTask(null);
  const editedTask = useMemo(() => {
    return tasks.find(task => task.id === editTaskId);
  }, [editTaskId, tasks]);

  const handleUpdateSubmit = async (taskId: number, patch: Partial<Task>) => {
    if (!token) return;
    const afterUpdate = await taskController.update(taskId, patch, token);
    dispatch(updateTask(afterUpdate));
  };

  const handleDelete = (taskId: number) => {
    setEditedTask(null);
    handleRemove([taskId]);
  };

  return (
    <Page className="tasks-page">
      <main>
        <AppHeader title="Todo" />
        <section className="create-task">
          <Checkbox checked={checkAll} onChange={handleCheckAll} />
          <TextInput
            type="text"
            id="new-task"
            title="New Task"
            placeholder="New Task"
            value={newTaskTitle}
            onChange={handleTextChange}
            onKeyDown={handleKeyEvent}
          />
        </section>
        <TaskList list={tasks} onRemove={handleRemove} onEdit={handleOpenEdit} />
      </main>
      <Footer>
        <span>Select a task to open it in the edit panel</span>
      </Footer>
      {!!users && (
        <TaskEditPanel
          task={editedTask}
          isPersonal={isPersonal}
          users={users}
          onClose={handleCloseEdit}
          onSubmit={handleUpdateSubmit}
          onDelete={handleDelete}
        />
      )}
    </Page>
  );
}
