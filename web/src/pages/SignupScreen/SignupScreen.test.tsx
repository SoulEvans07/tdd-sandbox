import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Random } from '../../helpers/Random';
import { mockRegisterResponse, mockNewUser } from '../../mocks/auth/postRegister';
import { SignupScreen } from './SignupScreen';

describe('SignupScreen', () => {
  let nameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    render(
      <MemoryRouter>
        <SignupScreen />
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
      userEvent.type(passwordInput, Random.string(5));
      const shortError = screen.getByRole('alert');
      expect(shortError).toHaveTextContent(/password is too short/i);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, Random.string(6));
      const noShortError = screen.queryByRole('alert');
      expect(noShortError).not.toBeInTheDocument();

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, Random.string(33));
      const longError = screen.getByRole('alert');
      expect(longError).toHaveTextContent(/password is too long/i);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, Random.string(32));
      const noLongError = screen.queryByRole('alert');
      expect(noLongError).not.toBeInTheDocument();
    });
  });

  describe('submit', () => {
    test('submit works', async () => {
      expect(submitButton).toBeDisabled();

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

      const successText = await screen.findByText(mockRegisterResponse.message);
      expect(successText).toBeInTheDocument();
    });
  });
});
