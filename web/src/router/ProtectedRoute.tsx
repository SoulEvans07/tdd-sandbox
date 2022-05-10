import { PropsWithChildren, ReactElement } from 'react';
import { Navigate, PathRouteProps, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from './types';

interface ProtectedRouteProps {
  redirect?: string;
}

function ProtectedPage(props: PropsWithChildren<ProtectedRouteProps>): ReactElement {
  const { children, redirect = ROUTES.LOGIN } = props;
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser === null) {
    // https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    const redirectTo = <Navigate to={redirect} state={{ from: location }} replace />;
    return redirectTo;
  }

  return <>{children}</>;
}

export function protectedRoute(props: PathRouteProps & ProtectedRouteProps) {
  const { redirect, element, ...restProps } = props;
  return <Route {...restProps} element={<ProtectedPage redirect={redirect}>{element}</ProtectedPage>} />;
}
