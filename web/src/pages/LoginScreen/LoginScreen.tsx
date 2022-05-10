import { FormEvent, ChangeEvent, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.scss';
import { serverUrl } from '../../config';
import Page from '../../components/layout/Page/Page';
import AppHeader from '../../containers/AppHeader/AppHeader';
import TextInput from '../../components/control/TextInput/TextInput';
import Button from '../../components/control/Button/Button';
import TextLink from '../../components/control/TextLink/TextLink';
import Footer from '../../components/layout/Footer/Footer';

interface LoginForm {
  username: string;
  password: string;
}

const emptyLoginForm: LoginForm = {
  username: '',
  password: '',
};

export default function LoginScreen(): ReactElement {
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>();

  const [{ username, password }, setForm] = useState<LoginForm>(emptyLoginForm);

  const handlFieldChange =
    (field: keyof LoginForm) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(serverUrl + '/api/1.0/auth/login', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(res => res.json())
      .then(data => navigate('/tasks'))
      .catch(e => setError(true));
  };

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
        <TextLink color="rainbow" href="/signup">
          Sign up here!
        </TextLink>
      </Footer>
    </Page>
  );
}
