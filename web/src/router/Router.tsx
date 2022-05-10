import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { protectedRoute } from './ProtectedRoute';
import { LoginScreen } from '../pages/LoginScreen/LoginScreen';
import { SignupScreen } from '../pages/SignupScreen/SignupScreen';
import { TasksPage } from '../pages/TasksPage/TasksPage';
import { ROUTES } from './types';

export function Router(): ReactElement {
  return (
    <Routes>
      <Route index element={<Navigate to={ROUTES.LOGIN} />} />
      <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
      <Route path={ROUTES.SIGNUP} element={<SignupScreen />} />
      {protectedRoute({ path: ROUTES.TASKS, element: <TasksPage /> })}
    </Routes>
  );
}
