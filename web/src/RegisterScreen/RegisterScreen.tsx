import { ChangeEvent, FormEvent, ReactElement, useMemo, useState } from 'react';
import './RegisterScreen.scss';
import TextInput from '../components/TextInput/TextInput';
import ValidatedTextInput from '../components/TextInput/ValidatedTextInput';
import { serverUrl } from '../config';
import { minMaxValidator } from '../validators/string-validators';

export default function RegisterScreen(): ReactElement {
  const [result, setResult] = useState<string>();
  const [error, setError] = useState<boolean>();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirm = (e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value);

  const isValid = useMemo(() => {
    return !error && username.length > 0 && email.length > 0 && confirm.length > 0;
  }, [error, username, email, password, confirm]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(serverUrl + '/api/1.0/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then(res => res.json())
      .then(data => setResult(data.message))
      .catch(_ => setError(true));
  };

  if (result) return <span>{result}</span>;
  if (error) return <span role="alert">Registration Error</span>;

  return (
    <section className="register-screen">
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
          value={confirm}
          onChange={handleConfirm}
        />
        <button disabled={!isValid} type="submit">
          Register
        </button>
      </form>
    </section>
  );
}
