import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Random } from '../../helpers/Random';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { AuthProvider } from '../../contexts/auth/AuthContext';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { ThemeProvider } from '../../contexts/theme/ThemeContext';
import { SignupScreen } from './SignupScreen';
import { ROUTES } from '../../router/types';

describe('SignupPage', () => {
  let nameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  supressErrorMessages();

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={[ROUTES.SIGNUP]}>
        <ThemeProvider initial="dark">
          <AuthProvider initial={{ currentUser: undefined, token: undefined }}>
            <StoreProvider>
              <Routes>
                <Route path={ROUTES.SIGNUP} element={<SignupScreen />} />
                <Route path={ROUTES.LOGIN} element={<h1>Login</h1>} />
              </Routes>
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    nameInput = screen.getByRole('textbox', { name: 'username' }) as HTMLInputElement;
    emailInput = screen.getByRole('textbox', { name: 'email' }) as HTMLInputElement;
    passwordInput = screen.getByRole('textbox', { name: 'password' }) as HTMLInputElement;
    confirmInput = screen.getByRole('textbox', { name: 'confirm-password' }) as HTMLInputElement;
    submitButton = screen.getByRole('button', { name: /register/i }) as HTMLButtonElement;
  });

  it('page composition', () => {
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe('validation', () => {
    it('password', async () => {
      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, Random.string(7));
      const shortError = screen.getByRole('alert');
      expect(shortError).toHaveTextContent(/password is too short/i);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, Random.string(8));
      const strengthError = screen.queryByRole('alert');
      expect(strengthError).toHaveTextContent(/password is too weak/i);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, 'Random12345!');
      const noShortError = screen.queryByRole('alert');
      expect(noShortError).not.toBeInTheDocument();

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, Random.string(33));
      const longError = screen.getByRole('alert');
      expect(longError).toHaveTextContent(/password is too long/i);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, '32char-really-long-Password12345');
      const noLongError = screen.queryByRole('alert');
      expect(noLongError).not.toBeInTheDocument();
    });
  });

  describe('submit', () => {
    test('submit works', async () => {
      expect(submitButton).toBeDisabled();

      const mockNewUser = {
        username: 'new.user',
        email: 'new.user',
        password: 'StrongP4$$',
      };

      userEvent.clear(nameInput);
      userEvent.type(nameInput, mockNewUser.username);
      expect(nameInput).toHaveValue(mockNewUser.username);

      userEvent.clear(emailInput);
      userEvent.type(emailInput, mockNewUser.email);
      expect(emailInput).toHaveValue(mockNewUser.email);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, mockNewUser.password);
      expect(passwordInput).toHaveValue(mockNewUser.password);

      userEvent.clear(confirmInput);
      userEvent.type(confirmInput, mockNewUser.password);
      expect(confirmInput).toHaveValue(mockNewUser.password);

      expect(submitButton).toBeEnabled();
      userEvent.click(submitButton);

      await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /sign up/i }));

      const loginPageHeading = await screen.findByRole('heading', { name: /login/i });
      expect(loginPageHeading).toBeInTheDocument();
    });
  });
});
