import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { mockUsers } from '../../mocks/managers/mockData';
import { AuthConsumer, AuthContext, AuthProvider, AuthState } from './AuthContext';

describe('AuthContext', () => {
  supressErrorMessages();

  const customRender = (ui: ReactNode, data: AuthState) => {
    return render(<AuthProvider initial={data}>{ui}</AuthProvider>);
  };

  const mockUser = mockUsers[0];
  const mockAuthConsumer = (value: AuthContext | undefined) => {
    if (!value) return <></>;
    const { currentUser, token, login, logout, refreshToken } = value;
    return (
      <>
        <button onClick={() => login(mockUser.data, mockUser.token)}>login</button>
        <button onClick={() => logout()}>logout</button>
        <button onClick={() => refreshToken()}>refresh</button>
        {currentUser && <div>{currentUser.username}</div>}
        {token && <div>{token}</div>}
      </>
    );
  };

  it('uses initial value', () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, {
      currentUser: mockUser.data,
      token: mockUser.token,
    });
    expect(screen.getByText(mockUser.data.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.token)).toBeInTheDocument();
  });

  it('login', async () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, { currentUser: undefined, token: undefined });

    const loginBtn = screen.getByRole('button', { name: /login/i });
    userEvent.click(loginBtn);

    const username = await screen.findByText(mockUser.data.username);
    expect(username).toBeInTheDocument();

    const token = await screen.findByText(mockUser.token);
    expect(token).toBeInTheDocument();
  });

  it('logout', () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, {
      currentUser: mockUser.data,
      token: mockUser.token,
    });
    expect(screen.getByText(mockUser.data.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.token)).toBeInTheDocument();

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    userEvent.click(logoutBtn);

    expect(screen.queryByText(mockUser.data.username)).not.toBeInTheDocument();
    expect(screen.queryByText(mockUser.token)).not.toBeInTheDocument();
  });

  it('refreshToken', async () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, {
      currentUser: mockUser.data,
      token: mockUser.token,
    });
    expect(screen.getByText(mockUser.data.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.token)).toBeInTheDocument();

    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    userEvent.click(refreshBtn);

    expect(screen.getByText(mockUser.data.username)).toBeInTheDocument();
    const newToken = await screen.findByText(mockUser.refreshedToken);
    expect(newToken).toBeInTheDocument();
  });
});
