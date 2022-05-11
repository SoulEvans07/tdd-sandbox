import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authController } from '../controllers/AuthController';
import { useLocation } from '../hooks/userLocation';
import { ROUTES } from '../router/types';

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

export type AuthState = Omit<AuthContext, 'login' | 'logout' | 'refreshToken'>;

export const clearedState: AuthState = { currentUser: undefined, token: undefined };

interface AuthProviderProps {
  initial: AuthState;
  onLogin?: (user: User, token: string) => void;
  onLogout?: VoidFunction;
}

export function AuthProvider(props: PropsWithChildren<AuthProviderProps>): ReactElement {
  const { initial, onLogin, onLogout } = props;
  const [userData, setState] = useState<AuthState>(initial);
  const location = useLocation();
  const navigate = useNavigate();

  const login = (currentUser: User, token: string) => {
    setState({ currentUser, token });
    if (onLogin) onLogin(currentUser, token);
  };

  const logout = () => {
    if (onLogout) onLogout();
    setState(clearedState);
  };

  const refreshToken = async (token: string) => {
    try {
      const response = await authController.refreshToken(token);
      login(response.user, response.token);
    } catch (e) {
      logout();
      navigate(ROUTES.LOGIN, { state: { from: location } });
    }
  };

  useEffect(() => {
    if (initial?.currentUser && initial?.token) {
      refreshToken(initial.token);
    }
  }, [initial]);

  return <Auth.Provider value={{ ...userData, login, logout }} {...props} />;
}
