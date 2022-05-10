import { ReactElement } from 'react';
import './AppHeader.scss';

interface AppHeaderProps {
  title: string;
}

export default function AppHeader(props: AppHeaderProps): ReactElement {
  const { title } = props;
  return (
    <header className="app-header">
      <h1>{title}</h1>
    </header>
  );
}
