import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authController } from '../controllers/AuthController';
import { useLocation } from '../hooks/userLocation';
import { ROUTES } from '../router/types';
import { secureStorage } from '../services/storage/secureStorage';

export const authStoreKey = 'io.todo.auth';

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContext {
  currentUser: User | undefined;
  token: string | undefined;
  login: (user: User, token: string) => void;
  logout: VoidFunction;
}

const Auth = createContext<AuthContext | undefined>(undefined);

export function useAuth() {
  const context = useContext(Auth);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

type AuthState = Omit<AuthContext, 'login' | 'logout' | 'refreshToken'>;

const initialState: AuthState = { currentUser: undefined, token: undefined };

export function AuthProvider(props: PropsWithChildren<{}>): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [{ currentUser, token }, setState] = useState<AuthState>(initialState);

  const login = (currentUser: User, token: string) => {
    const userData = { currentUser, token };
    setState(userData);
    secureStorage.set(authStoreKey, userData);
  };

  const logout = () => {
    secureStorage.remove(authStoreKey);
    setState(initialState);
  };

  const refreshToken = async (token: string) => {
    try {
      const response = await authController.refreshToken(token);
      const newUserData = { currentUser: response.user, token: response.token };
      setState(newUserData);
      secureStorage.set(authStoreKey, newUserData);
    } catch (e) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
    }
  };

  useEffect(() => {
    const storedValue = secureStorage.get<AuthState>(authStoreKey);
    if (storedValue?.currentUser && storedValue?.token) {
      setState(storedValue);
      refreshToken(storedValue.token);
    }
  }, []);

  return <Auth.Provider value={{ currentUser, token, login, logout }} {...props} />;
}
