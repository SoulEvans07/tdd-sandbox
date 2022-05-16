import { ReactElement, useEffect, useMemo, useState } from 'react';
import './AppHeader.scss';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileImg } from '../../components/ui/ProfileImg/ProfileImg';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { DropMenu } from '../../components/control/DropMenu/DropMenu';
import { userController } from '../../controllers/UserController';
import { useDispatch, useSelector } from '../../contexts/store/StoreContext';
import { changeWorkspace, clearData, loadWorkspaces } from '../../contexts/store/actions';
import { selectActiveWorkspace, selectWorkspaces } from '../../contexts/store/selectors';
import { personalWs, Workspace } from '../../contexts/store/types';

function sortPersonalToTop(a: Workspace, b: Workspace): number {
  if (a.id === personalWs) return -1;
  if (b.id === personalWs) return 1;
  return a.name.localeCompare(b.name);
}

interface AppHeaderProps {
  title: string;
}

export function AppHeader(props: AppHeaderProps): ReactElement {
  const dispatch = useDispatch();
  const workspaces = useSelector(selectWorkspaces);
  const { workspace: activeWs } = useSelector(selectActiveWorkspace);
  const { currentUser, token, logout } = useAuth();
  const { title } = props;

  const [menuOpen, setMenu] = useState(false);
  const switchMenu = () => setMenu(prev => !prev);
  const closeMenu = () => setMenu(false);
  const onLogout = () => {
    logout();
    dispatch(clearData());
  };

  useEffect(() => {
    if (token) {
      userController.getWorkspaces(token).then(ws => dispatch(loadWorkspaces(ws)));
    }
  }, [currentUser]);

  const workspaceOptions = useMemo(() => {
    const changeWs = (id: string) => () => dispatch(changeWorkspace(id));
    const orderedWorkspaces = Object.values(workspaces).sort(sortPersonalToTop);
    return orderedWorkspaces.map(ws => (
      <span id={ws.id} key={ws.id} onClick={changeWs(ws.id)}>
        {ws.name}
      </span>
    ));
  }, [workspaces, currentUser]);

  return (
    <header className="app-header">
      <h1>{title}</h1>
      {!!currentUser && <h2>{activeWs.name}</h2>}
      <ThemeSwitch />
      {!!currentUser && (
        <div className="user-menu">
          <ProfileImg className="profile" username={currentUser.username} onClick={switchMenu} />
          <DropMenu open={menuOpen} onSelect={closeMenu} selectedId={activeWs.id}>
            {workspaceOptions}
            <hr />
            <span onClick={onLogout}>Logout</span>
          </DropMenu>
        </div>
      )}
    </header>
  );
}
