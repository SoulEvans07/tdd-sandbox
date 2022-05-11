import { ReactElement } from 'react';
import './AppHeader.scss';
import { useAuth } from '../../contexts/AuthContext';
import ProfileImg from '../../components/ui/ProfileImg/ProfileImg';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

interface AppHeaderProps {
  title: string;
}

export function AppHeader(props: AppHeaderProps): ReactElement {
  const { currentUser, logout } = useAuth();
  const { title } = props;

  return (
    <header className="app-header">
      <h1>{title}</h1>
      <ThemeSwitch />
      {!!currentUser && <ProfileImg className="profile" username={currentUser.username} onClick={() => logout()} />}
    </header>
  );
}
