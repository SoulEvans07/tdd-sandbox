import { createContext, PropsWithChildren, ReactElement, useContext, useMemo, useState } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
}

type LoginFunction = (user: User, token: string) => void;

interface AuthContext {
  currentUser: User | null;
  token: string | null;
  login: LoginFunction;
  logout: VoidFunction;
}

const Auth = createContext<AuthContext | undefined>(undefined);

export function useAuth() {
  const context = useContext(Auth);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

type AuthState = Omit<AuthContext, 'login' | 'logout'>;

const initialState: AuthState = { currentUser: null, token: null };

export function AuthProvider(props: PropsWithChildren<{}>): ReactElement {
  const [{ currentUser, token }, setState] = useState<AuthState>(initialState);

  const value = useMemo((): AuthContext => {
    const login = (currentUser: User, token: string) => setState({ currentUser, token });
    const logout = () => setState(initialState);
    return { currentUser, token, login, logout };
  }, [currentUser, token]);

  return <Auth.Provider value={value} {...props} />;
}
