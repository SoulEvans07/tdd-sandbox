import { ReactElement, useState } from 'react';
import './AppHeader.scss';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileImg } from '../../components/ui/ProfileImg/ProfileImg';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { DropMenu } from '../../components/control/DropMenu/DropMenu';
import { personalWs } from '../../contexts/store/types';

interface AppHeaderProps {
  title: string;
}

export function AppHeader(props: AppHeaderProps): ReactElement {
  const { currentUser, logout } = useAuth();
  const { title } = props;
  const [menuOpen, setMenu] = useState(false);
  const switchMenu = () => setMenu(prev => !prev);
  const closeMenu = () => setMenu(false);
  const onLogout = () => logout();

  return (
    <header className="app-header">
      <h1>{title}</h1>
      <ThemeSwitch />
      {!!currentUser && (
        <div className="user-menu">
          <ProfileImg className="profile" username={currentUser.username} onClick={switchMenu} />
          <DropMenu open={menuOpen} onSelect={closeMenu}>
            <span id={personalWs}>Personal</span>
            <hr />
            <span onClick={onLogout}>Logout</span>
          </DropMenu>
        </div>
      )}
    </header>
  );
}
