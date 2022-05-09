import { ChangeEvent, FormEvent, ReactElement, useMemo, useState } from 'react';
import './SignupScreen.scss';
import { serverUrl } from '../../config';
import { minMaxValidator } from '../../validators/string-validators';
import Page from '../../components/layout/Page/Page';
import TextInput from '../../components/control/TextInput/TextInput';
import ValidatedTextInput from '../../components/control/TextInput/ValidatedTextInput';
import AppHeader from '../../containers/AppHeader/AppHeader';
import Button from '../../components/control/Button/Button';
import TextLink from '../../components/control/TextLink/TextLink';

interface RegistrationForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emptyRegForm: RegistrationForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupScreen(): ReactElement {
  const [result, setResult] = useState<string>();
  const [error, setError] = useState<boolean>();

  const [{ username, email, password, confirmPassword }, setForm] = useState<RegistrationForm>(emptyRegForm);

  const changeFormValue = (field: keyof RegistrationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => changeFormValue('username', e.target.value);
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => changeFormValue('email', e.target.value);
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => changeFormValue('password', e.target.value);
  const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) =>
    changeFormValue('confirmPassword', e.target.value);

  const isValid = useMemo(() => {
    return username.length > 0 && email.length > 0 && password.length && confirmPassword.length > 0;
  }, [username, email, password, confirmPassword]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(serverUrl + '/api/1.0/users', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then(res => res.json())
      .then(data => setResult(data.message))
      .catch(e => setError(true));
  };

  if (result) return <span>{result}</span>;
  if (error) return <span role="alert">Registration Error</span>;

  return (
    <Page className="signup-screen">
      <main className="card">
        <AppHeader />
        <form onSubmit={handleSubmit}>
          <TextInput id="username" placeholder="Username" value={username} onChange={handleUsername} />
          <TextInput id="email" placeholder="Email" value={email} onChange={handleEmail} />
          <ValidatedTextInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            validator={minMaxValidator(6, 32)}
          />
          <TextInput
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
          />
          <Button disabled={!isValid} type="submit" size="big" color="primary">
            Register
          </Button>
        </form>
      </main>
      <footer>
        You already have an account? <TextLink color="rainbow"> Sign in here!</TextLink>
      </footer>
    </Page>
  );
}
