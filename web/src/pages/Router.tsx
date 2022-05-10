import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginScreen } from './LoginScreen/LoginScreen';
import { SignupScreen } from './SignupScreen/SignupScreen';
import { TasksPage } from './TasksPage/TasksPage';

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  TASKS: '/tasks',
} as const;

export function Router(): ReactElement {
  return (
    <Routes>
      <Route index element={<Navigate to={ROUTES.LOGIN} />} />
      <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
      <Route path={ROUTES.SIGNUP} element={<SignupScreen />} />
      <Route path={ROUTES.TASKS} element={<TasksPage />} />
    </Routes>
  );
}
