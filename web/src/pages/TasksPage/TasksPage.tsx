import { ChangeEvent, KeyboardEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import socketClient, { Socket } from 'socket.io-client';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { Checkbox } from '../../components/control/Checkbox/Checkbox';
import { TaskList } from '../../containers/TaskList/TaskList';
import { StoreDispatch, useDispatch, useSelector } from '../../contexts/store/StoreContext';
import { selectActiveWorkspace, selectWorkspaceTasks } from '../../contexts/store/selectors';
import { Task } from '../../contexts/store/types';
import { createTask, loadTasks, removeMultipleTask, updateTask } from '../../contexts/store/actions';
import { TaskResponseDTO } from '../../managers/TaskManager';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Footer } from '../../components/layout/Footer/Footer';
import { TaskEditPanel } from '../../containers/TaskEditPanel/TaskEditPanel';
import { RestrictedUserDTO } from '../../managers/UserManager';
import { serverUrl } from '../../config';
import { taskManager, userManager } from '../../services/api';

const socketConnect = (token: string, dispatch: StoreDispatch): Socket => {
  const socket = socketClient(serverUrl);

  socket.on('connection', () => {
    console.log('Hallelujah!');
    socket.emit('auth', token);

    socket.on('task-created', (task: TaskResponseDTO) => {
      console.log('[new task]', task);
      dispatch(createTask(task));
    });
  });

  return socket;
};

export function TasksPage(): ReactElement {
  const dispatch = useDispatch();
  const { currentUser, token } = useAuth();
  const { workspace: activeWs, isPersonal } = useSelector(selectActiveWorkspace);
  const tasks = useSelector(selectWorkspaceTasks);
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckAll = (checked: boolean) => setCheckAll(checked);

  const [users, setUsers] = useState<RestrictedUserDTO[]>();
  useEffect(() => {
    let socket: Socket;

    if (currentUser && token) {
      taskManager
        .list(token, isPersonal ? undefined : Number(activeWs.id))
        .then(list => dispatch(loadTasks(list, activeWs.id)));

      if (isPersonal) setUsers([currentUser]);
      else userManager.list(Number(activeWs.id), token).then(list => setUsers(list));

      socket = socketConnect(token, dispatch);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [activeWs.id, isPersonal]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value);
  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!!newTaskTitle && e.key === 'Enter') handleCreate();
  };

  const handleCreate = () => {
    if (!token) return;
    taskManager
      .create({ title: newTaskTitle, tenantId: isPersonal ? undefined : Number(activeWs.id) }, token)
      .then(newTask => dispatch(createTask(newTask)));
    setNewTaskTitle('');
  };

  const handleRemove = (taskIds: Array<Task['id']>) => {
    if (!token) return;
    taskManager.remove(taskIds, token).then(() => dispatch(removeMultipleTask(taskIds)));
  };

  const [editTaskId, setEditedTask] = useState<Task['id'] | null>(null);
  const handleOpenEdit = (taskId: Task['id']) => setEditedTask(taskId);
  const handleCloseEdit = () => setEditedTask(null);
  const editedTask = useMemo(() => {
    return tasks.find(task => task.id === editTaskId);
  }, [editTaskId, tasks]);

  const handleUpdateSubmit = async (taskId: number, patch: Partial<Task>) => {
    if (!token) return;
    const afterUpdate = await taskManager.update(taskId, patch, token);
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
