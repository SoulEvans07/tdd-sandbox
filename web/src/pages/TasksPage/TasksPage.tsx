import { ChangeEvent, KeyboardEvent, ReactElement, useEffect, useState } from 'react';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { Checkbox } from '../../components/control/Checkbox/Checkbox';
import { TaskList } from '../../containers/TaskList/TaskList';
import { useDispatch, useSelector } from '../../contexts/store/StoreContext';
import { selectActiveWorkspace, selectWorkspaceTasks } from '../../contexts/store/selectors';
import { Task } from '../../contexts/store/types';
import { createTask, loadTasks, removeTask } from '../../contexts/store/actions';
import { taskController } from '../../controllers/TaskController';
import { useAuth } from '../../contexts/AuthContext';

export function TasksPage(): ReactElement {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { workspace, isPersonal } = useSelector(selectActiveWorkspace);
  const tasks = useSelector(selectWorkspaceTasks);
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckAll = (checked: boolean) => setCheckAll(checked);

  useEffect(() => {
    if (token) {
      taskController
        .list(token, isPersonal ? undefined : Number(workspace))
        .then(list => dispatch(loadTasks(list, workspace)));
    }
  }, [workspace]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value);
  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!!newTaskTitle && e.key === 'Enter') handleCreate();
  };

  const handleCreate = () => {
    if (!token) return;
    taskController.create({ title: newTaskTitle }, token).then(newTask => dispatch(createTask(newTask)));
    setNewTaskTitle('');
  };

  const handleRemove = (task: Task) => {
    if (!token) return;
    taskController.remove([task.id], token).then(() => dispatch(removeTask(task)));
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
        <TaskList list={tasks} onRemove={handleRemove} />
      </main>
    </Page>
  );
}
