import { ChangeEvent, FormEvent, ReactElement, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './SignupScreen.scss';
import { userController } from '../../controllers/UserController';
import { useAuth } from '../../contexts/AuthContext';
import { minMaxValidator } from '../../validators/string-validators';
import { Page } from '../../components/layout/Page/Page';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { ValidatedTextInput } from '../../components/control/TextInput/ValidatedTextInput';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { Button } from '../../components/control/Button/Button';
import { TextLink } from '../../components/control/TextLink/TextLink';
import { Footer } from '../../components/layout/Footer/Footer';
import { ROUTES } from '../../router/types';

interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emptyRegForm: SignupForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function SignupScreen(): ReactElement {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [error, setError] = useState<boolean>();

  const [{ username, email, password, confirmPassword }, setForm] = useState<SignupForm>(emptyRegForm);

  const handlFieldChange =
    (field: keyof SignupForm) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };

  const isValid = useMemo(() => {
    return username.length > 0 && email.length > 0 && password.length && confirmPassword.length > 0;
  }, [username, email, password, confirmPassword]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    userController
      .register({ username, email, password })
      .then(() => navigate(ROUTES.LOGIN))
      .catch(e => setError(true));
  };

  if (currentUser) return <Navigate to={ROUTES.TASKS} />;

  return (
    <Page className="signup-screen">
      <main className="card">
        <AppHeader title="Sign up" />
        <form onSubmit={handleSubmit}>
          <TextInput id="username" placeholder="Username" value={username} onChange={handlFieldChange('username')} />
          <TextInput id="email" placeholder="Email" value={email} onChange={handlFieldChange('email')} />
          <ValidatedTextInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlFieldChange('password')}
            validator={minMaxValidator(6, 32)}
          />
          <TextInput
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={handlFieldChange('confirmPassword')}
          />
          <div className="row">
            {error && (
              <span className="error-message" role="alert">
                Registration Error
              </span>
            )}
            <Button disabled={!isValid} type="submit" size="big" color="primary">
              Register
            </Button>
          </div>
        </form>
      </main>
      <Footer>
        You already have an account?
        <TextLink color="rainbow" href={ROUTES.LOGIN}>
          Login here!
        </TextLink>
      </Footer>
    </Page>
  );
}
