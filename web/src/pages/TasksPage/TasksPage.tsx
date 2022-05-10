import { ReactElement } from 'react';
import Page from '../../components/layout/Page/Page';
import AppHeader from '../../containers/AppHeader/AppHeader';
import './TasksPage.scss';

export default function TasksPage(): ReactElement {
  return (
    <Page className="tasks-page">
      <main>
        <AppHeader title="Todo" />
      </main>
    </Page>
  );
}
