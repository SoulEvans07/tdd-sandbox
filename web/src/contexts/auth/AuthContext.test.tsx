import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { mockJwtToken, mockRefreshedToken, mockUser } from '../../mocks/controllers/mockData';
import { AuthConsumer, AuthContext, AuthProvider, AuthState } from './AuthContext';

describe('AuthContext', () => {
  supressErrorMessages();

  const customRender = (ui: ReactNode, data: AuthState) => {
    return render(<AuthProvider initial={data}>{ui}</AuthProvider>);
  };

  const mockAuthConsumer = (value: AuthContext | undefined) => {
    if (!value) return <></>;
    const { currentUser, token, login, logout, refreshToken } = value;
    return (
      <>
        <button onClick={() => login(mockUser, mockJwtToken)}>login</button>
        <button onClick={() => logout()}>logout</button>
        <button onClick={() => refreshToken()}>refresh</button>
        {currentUser && <div>{currentUser.username}</div>}
        {token && <div>{token}</div>}
      </>
    );
  };

  it('uses initial value', () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, { currentUser: mockUser, token: mockJwtToken });
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockJwtToken)).toBeInTheDocument();
  });

  it('login', async () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, { currentUser: undefined, token: undefined });

    const loginBtn = screen.getByRole('button', { name: /login/i });
    userEvent.click(loginBtn);

    const username = await screen.findByText(mockUser.username);
    expect(username).toBeInTheDocument();

    const token = await screen.findByText(mockJwtToken);
    expect(token).toBeInTheDocument();
  });

  it('logout', () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, { currentUser: mockUser, token: mockJwtToken });
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockJwtToken)).toBeInTheDocument();

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    userEvent.click(logoutBtn);

    expect(screen.queryByText(mockUser.username)).not.toBeInTheDocument();
    expect(screen.queryByText(mockJwtToken)).not.toBeInTheDocument();
  });

  it('refreshToken', async () => {
    customRender(<AuthConsumer>{mockAuthConsumer}</AuthConsumer>, { currentUser: mockUser, token: mockJwtToken });
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockJwtToken)).toBeInTheDocument();

    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    userEvent.click(refreshBtn);

    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    const newToken = await screen.findByText(mockRefreshedToken);
    expect(newToken).toBeInTheDocument();
  });
});
