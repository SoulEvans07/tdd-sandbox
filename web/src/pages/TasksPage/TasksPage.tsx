import { ReactElement } from 'react';
import './TasksPage.scss';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';

export function TasksPage(): ReactElement {
  return (
    <Page className="tasks-page">
      <main>
        <AppHeader title="Todo" />
      </main>
    </Page>
  );
}
