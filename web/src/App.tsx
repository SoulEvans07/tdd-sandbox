import { ReactElement, useCallback, useEffect, useState } from 'react';
import './root.scss';
import { persistentStorage } from './services/storage/persistentStorage';
import { AuthProvider, AuthState, clearedState, User } from './contexts/auth/AuthContext';
import { ThemeName, ThemeProvider } from './contexts/theme/ThemeContext';
import { StoreProvider } from './contexts/store/StoreContext';
import { ThemeSetter } from './containers/ThemeSwitch/ThemeSetter';
import { Router } from './router/Router';
import { secureStorage } from './services/storage/secureStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from './router/types';

const themeStoreKey = 'io.todo.theme';
const authStoreKey = 'io.todo.auth';

const onThemeChange = (theme: ThemeName) => persistentStorage.set(themeStoreKey, theme);
const onLogin = (currentUser: User, token: string) => secureStorage.set(authStoreKey, { currentUser, token });

export default function App(): ReactElement {
  const [initialTheme, setTheme] = useState<ThemeName>();
  const [initialUser, setUserData] = useState<AuthState>(clearedState);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = persistentStorage.get<ThemeName>(themeStoreKey);
    setTheme(storedTheme || 'dark');

    const storedUser = secureStorage.get<AuthState>(authStoreKey);
    setUserData(storedUser || clearedState);
    if (storedUser?.currentUser && storedUser?.token) setUserData(storedUser);
  }, []);

  const onLogout = useCallback(() => {
    secureStorage.remove(authStoreKey);
    navigate(ROUTES.LOGIN, { state: { from: location } });
  }, [location]);

  if (!initialTheme || !initialUser) return <></>; // TODO: put loading spinner here

  return (
    <ThemeProvider initial={initialTheme} onChange={onThemeChange}>
      <ThemeSetter>
        <AuthProvider initial={initialUser} onLogin={onLogin} onLogout={onLogout}>
          <StoreProvider>
            <Router />
          </StoreProvider>
        </AuthProvider>
      </ThemeSetter>
    </ThemeProvider>
  );
}
