import { ChangeEvent, KeyboardEvent, ReactElement, useState } from 'react';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { Checkbox } from '../../components/control/Checkbox/Checkbox';
import { TaskList } from '../../containers/TaskList/TaskList';
import { useDispatch, useSelector } from '../../contexts/store/StoreContext';
import { selectActiveWorkspace } from '../../contexts/store/selectors';
import { Task } from '../../contexts/store/types';
import { createTask, removeTask } from '../../contexts/store/actions';

export function TasksPage(): ReactElement {
  const dispatch = useDispatch();
  const tasks = useSelector(selectActiveWorkspace);
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckAll = (checked: boolean) => setCheckAll(checked);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value);
  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!!newTaskTitle && e.key === 'Enter') handleCreate();
  };

  const handleCreate = () => {
    const newTask: Task = {
      id: tasks.length,
      title: newTaskTitle,
      status: 'todo',
    };
    dispatch(createTask(newTask));
    setNewTaskTitle('');
  };

  const handleRemove = (task: Task) => dispatch(removeTask(task));

  return (
    <Page className="tasks-page">
      <main>
        <AppHeader title="Todo" />
        <section className="create-task">
          <Checkbox checked={checkAll} onChange={handleCheckAll} />
          <TextInput
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
