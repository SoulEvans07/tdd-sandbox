import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react';
import { authManager } from '../../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  tenants: number[];
}

export interface AuthContext {
  currentUser: User | undefined;
  token: string | undefined;
  login: (user: User, token: string) => void;
  logout: VoidFunction;
  refreshToken: () => Promise<void>;
}

const Auth = createContext<AuthContext | undefined>(undefined);

export const AuthConsumer = Auth.Consumer;

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

  const login = (currentUser: User, token: string) => {
    setState({ currentUser, token });
    if (onLogin) onLogin(currentUser, token);
  };

  const logout = () => {
    if (onLogout) onLogout();
    setState(clearedState);
  };

  const refreshToken = async (token?: string) => {
    if (!token) return logout();
    try {
      const response = await authManager.refreshToken(token);
      login(response.user, response.token);
    } catch (e) {
      logout();
    }
  };

  useEffect(() => {
    if (initial?.currentUser && initial?.token) {
      refreshToken(initial.token);
    }
  }, [initial]);

  return (
    <Auth.Provider
      value={{ ...userData, login, logout, refreshToken: () => refreshToken(userData.token) }}
      {...props}
    />
  );
}
