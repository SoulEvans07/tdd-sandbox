import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Random } from '../helpers/Random';
import { mockRegisterResponse, mockNewUser } from '../mocks/postRegister';
import RegisterScreen from './RegisterScreen';

describe('RegisterScreen', () => {
  let nameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    render(<RegisterScreen />);

    nameInput = screen.getByRole('textbox', { name: 'username' }) as HTMLInputElement;
    emailInput = screen.getByRole('textbox', { name: 'email' }) as HTMLInputElement;
    passwordInput = screen.getByRole('textbox', { name: 'password' }) as HTMLInputElement;
    confirmInput = screen.getByRole('textbox', { name: 'confirm-password' }) as HTMLInputElement;

    submitButton = screen.getByRole('button', { name: /register/i }) as HTMLButtonElement;
  });

  it('has a username, email, password input and a submit button', () => {
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe('validation', () => {
    it('password', () => {
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

  describe.only('submit', () => {
    test('submit works', async () => {
      expect(submitButton).toBeDisabled();

      userEvent.clear(nameInput);
      userEvent.type(nameInput, mockNewUser.username);
      userEvent.clear(emailInput);
      userEvent.type(emailInput, mockNewUser.email);
      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, mockNewUser.password);
      userEvent.clear(confirmInput);
      userEvent.type(confirmInput, mockNewUser.password);

      await waitFor(() => expect(submitButton).toBeEnabled());

      userEvent.click(submitButton);

      const successText = await screen.findByText(mockRegisterResponse.message);
      expect(successText).toBeInTheDocument();
    });
  });
});
