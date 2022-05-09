import { ReactElement, useEffect, useState } from 'react';
import { serverUrl } from '../config';
import './HomeScreen.scss';

interface Ping {
  message: string;
}

export function HomeScreen(): ReactElement {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(serverUrl + '/api/1.0/ping', {
      headers: {
        'access-control-allow-origin': '*',
        mode: 'cors',
      },
    })
      .then(res => res.json())
      .then((data: Ping) => setMessage(data.message))
      .catch(err => setMessage(err.message));
  }, []);

  return (
    <main className="home-screen">
      <header>
        <a href="/" className="title">
          ToDo App
        </a>
      </header>
      <section>Message: {message}</section>
    </main>
  );
}
