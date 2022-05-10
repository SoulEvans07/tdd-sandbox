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
import Footer from '../../components/layout/Footer/Footer';

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

export default function SignupScreen(): ReactElement {
  const [result, setResult] = useState<string>();
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
        <TextLink color="rainbow" href="/login">
          Login here!
        </TextLink>
      </Footer>
    </Page>
  );
}
