import { ChangeEvent, FormEvent, ReactElement, useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './SignupScreen.scss';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Page } from '../../components/layout/Page/Page';
import { TextInput } from '../../components/control/TextInput/TextInput';
import { ValidatedInput } from '../../components/control/TextInput/ValidatedTextInput/ValidatedInput';
import { AppHeader } from '../../containers/AppHeader/AppHeader';
import { Button } from '../../components/control/Button/Button';
import { TextLink } from '../../components/control/TextLink/TextLink';
import { Footer } from '../../components/layout/Footer/Footer';
import { ROUTES } from '../../router/types';
import { PasswordInput } from '../../components/control/TextInput/PasswordInput';
import { StringValidator } from '../../validators/StringValidator';
import { strongPasswordRegEx } from '../../validators/types';
import { userManager } from '../../services/api';

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
    userManager
      .register({ username, email, password })
      .then(() => navigate(ROUTES.LOGIN))
      .catch(e => setError(true));
  };

  const confirmValidator = useCallback(StringValidator.match(password, "Password doesn't match"), [password]);

  if (currentUser) return <Navigate to={ROUTES.TASKS} />;

  const passwordValidator = StringValidator.compose(
    StringValidator.minLen(8, 'Password is too short'),
    StringValidator.maxLen(32, 'Password is too long'),
    StringValidator.match(strongPasswordRegEx, 'Password is too weak')
  );

  return (
    <Page className="signup-screen">
      <main className="card">
        <AppHeader title="Sign up" />
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={handlFieldChange('username')}
          />
          <TextInput type="text" id="email" placeholder="Email" value={email} onChange={handlFieldChange('email')} />
          <ValidatedInput
            validator={passwordValidator}
            Input={PasswordInput}
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlFieldChange('password')}
            enableShow
          />
          <ValidatedInput
            validator={confirmValidator}
            Input={PasswordInput}
            id="confirm-password"
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
