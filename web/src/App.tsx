import { ReactElement, useCallback, useEffect, useState } from 'react';
import './root.scss';
import { AuthProvider, AuthState, clearedState, User } from './contexts/auth/AuthContext';
import { StoreProvider } from './contexts/store/StoreContext';
import { ThemeSetter } from './containers/ThemeSwitch/ThemeSetter';
import { Router } from './router/Router';
import { secureStorage } from './services/storage/secureStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from './router/types';
import { Provider } from 'react-redux';
import store from './contexts/store';
import { persistentStorage } from './services/storage/persistentStorage';
import { ThemeName, useTheme } from './contexts/theme/ThemeSlice';

const themeStoreKey = 'io.todo.theme';
const authStoreKey = 'io.todo.auth';

const onLogin = (currentUser: User, token: string) => secureStorage.set(authStoreKey, { currentUser, token });

export default function App(): ReactElement {
  const { setTheme } = useTheme();
  const [initialUser, setUserData] = useState<AuthState>(clearedState);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = persistentStorage.get<ThemeName>(themeStoreKey);
    setTheme({ currentTheme: storedTheme || 'dark' });

    const storedUser = secureStorage.get<AuthState>(authStoreKey);
    setUserData(storedUser || clearedState);
    if (storedUser?.currentUser && storedUser?.token) setUserData(storedUser);
  }, []);

  const onLogout = useCallback(() => {
    secureStorage.remove(authStoreKey);
    navigate(ROUTES.LOGIN, { state: { from: location } });
  }, [location]);

  // if (!initialTheme || !initialUser) return <></>; // TODO: put loading spinner here
  if (!initialUser) return <></>; // TODO: put loading spinner here

  return (
    <ThemeSetter>
      <AuthProvider initial={initialUser} onLogin={onLogin} onLogout={onLogout}>
        <StoreProvider>
          <Router />
        </StoreProvider>
      </AuthProvider>
    </ThemeSetter>
  );
}
