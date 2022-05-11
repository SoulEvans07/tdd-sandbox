import { ChangeEvent, KeyboardEvent, ReactElement, useState } from 'react';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { Checkbox } from '../../components/control/Checkbox/Checkbox';

export function TasksPage(): ReactElement {
  const { currentUser, token } = useAuth();
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckAll = (checked: boolean) => setCheckAll(checked);

  const [newTask, setTaskText] = useState('');
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setTaskText(e.target.value);
  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') createNewTask();
  };
  const createNewTask = () => {
    setTaskText('');
  };

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
            value={newTask}
            onChange={handleTextChange}
            onKeyDown={handleKeyEvent}
          />
        </section>
      </main>
    </Page>
  );
}
