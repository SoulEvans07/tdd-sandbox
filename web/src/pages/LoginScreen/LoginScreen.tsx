import { FormEvent, ChangeEvent, ReactElement, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './LoginScreen.scss';
import { useLocation } from '../../hooks/userLocation';
import { useAuth, User } from '../../contexts/AuthContext';
import { authController } from '../../controllers/AuthController';
import { ROUTES } from '../../router/types';
import { Page } from '../../components/layout/Page/Page';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { Button } from '../../components/control/Button/Button';
import { TextLink } from '../../components/control/TextLink/TextLink';
import { Footer } from '../../components/layout/Footer/Footer';

interface LoginForm {
  username: string;
  password: string;
}

const emptyLoginForm: LoginForm = {
  username: '',
  password: '',
};

export function LoginScreen(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();

  const handleSuccess = (user: User, token: string) => {
    login(user, token);
    const next = location.state?.from?.pathname || ROUTES.TASKS;
    navigate(next, { replace: true });
  };

  const [error, setError] = useState<boolean>();
  const [{ username, password }, setForm] = useState<LoginForm>(emptyLoginForm);

  const handlFieldChange =
    (field: keyof LoginForm) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authController
      .login({ username, password })
      .then(data => handleSuccess(data.user, data.token))
      .catch(e => setError(true));
  };

  if (currentUser) return <Navigate to={ROUTES.TASKS} />;

  return (
    <Page className="login-screen">
      <main className="card">
        <AppHeader title="Login" />
        <form onSubmit={handleSubmit}>
          <TextInput id="username" placeholder="Username" value={username} onChange={handlFieldChange('username')} />
          <TextInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlFieldChange('password')}
          />
          <div className="row">
            {error && (
              <span className="error-message" role="alert">
                Username or password is wrong!
              </span>
            )}
            <Button type="submit" size="big" color="primary">
              Sign in
            </Button>
          </div>
        </form>
      </main>
      <Footer>
        You dont have an account yet?
        <TextLink color="rainbow" href={ROUTES.SIGNUP}>
          Sign up here!
        </TextLink>
      </Footer>
    </Page>
  );
}
