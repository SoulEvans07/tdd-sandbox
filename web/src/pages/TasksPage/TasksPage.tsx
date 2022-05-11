import { ReactElement } from 'react';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { TextInput } from '../../components/control/TextInput/TextInput';

export function TasksPage(): ReactElement {
  const { currentUser, token } = useAuth();

  return (
    <Page className="tasks-page">
      <main>
        <AppHeader title="Todo" />
        <section>
          <TextInput id="create-task" />
        </section>
      </main>
    </Page>
  );
}
