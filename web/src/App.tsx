import { ReactElement, useEffect, useState } from 'react';
import './root.scss';
import { persistentStorage } from './services/storage/persistentStorage';
import { AuthProvider, AuthState, clearedState, User } from './contexts/AuthContext';
import { ThemeName, ThemeProvider } from './contexts/ThemeContext';
import { ThemeSetter } from './containers/ThemeSetter/ThemeSetter';
import { Router } from './router/Router';
import { secureStorage } from './services/storage/secureStorage';

const themeStoreKey = 'io.todo.theme';
const authStoreKey = 'io.todo.auth';

const onThemeChange = (theme: ThemeName) => persistentStorage.set(themeStoreKey, theme);
const onLogout = () => secureStorage.remove(authStoreKey);
const onLogin = (currentUser: User, token: string) => secureStorage.set(authStoreKey, { currentUser, token });

export default function App(): ReactElement {
  const [initialTheme, setTheme] = useState<ThemeName>();
  const [initialUser, setUserData] = useState<AuthState>(clearedState);

  useEffect(() => {
    const storedTheme = persistentStorage.get<ThemeName>(themeStoreKey);
    setTheme(storedTheme || 'dark');

    const storedUser = secureStorage.get<AuthState>(authStoreKey);
    setUserData(storedUser || clearedState);
    if (storedUser?.currentUser && storedUser?.token) setUserData(storedUser);
  }, []);

  if (!initialTheme || !initialUser) return <></>; // TODO: put loading spinner here

  return (
    <ThemeProvider initial={initialTheme} onChange={onThemeChange}>
      <ThemeSetter>
        <AuthProvider initial={initialUser} onLogin={onLogin} onLogout={onLogout}>
          <Router />
        </AuthProvider>
      </ThemeSetter>
    </ThemeProvider>
  );
}
