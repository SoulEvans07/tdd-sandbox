import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import { ROUTES } from './types';
import { protectedRoute } from './ProtectedRoute';
import { LoginScreen } from '../pages/LoginScreen/LoginScreen';
import { SignupScreen } from '../pages/SignupScreen/SignupScreen';
import { TasksPage } from '../pages/TasksPage/TasksPage';

export function Router(): ReactElement {
  const { currentUser } = useAuth();
  const rootPage = !currentUser ? ROUTES.LOGIN : ROUTES.TASKS;

  return (
    <Routes>
      <Route index element={<Navigate to={rootPage} />} />
      <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
      <Route path={ROUTES.SIGNUP} element={<SignupScreen />} />
      {protectedRoute({ path: ROUTES.TASKS, element: <TasksPage /> })}
    </Routes>
  );
}
