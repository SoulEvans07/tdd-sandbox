import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginScreen } from './LoginScreen/LoginScreen';
import { SignupScreen } from './SignupScreen/SignupScreen';
import { TasksPage } from './TasksPage/TasksPage';

export function Router(): ReactElement {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/tasks" element={<TasksPage />} />
    </Routes>
  );
}
