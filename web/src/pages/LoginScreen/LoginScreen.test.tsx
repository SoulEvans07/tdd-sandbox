import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mockExistingUser } from '../../mocks/auth/postLogin';
import Router from '../Router';

describe('LoginScreen', () => {
  let titleHeading: HTMLHeadingElement;
  let nameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Router />
      </MemoryRouter>
    );

    titleHeading = screen.getByRole('heading', { name: /login/i }) as HTMLHeadingElement;
    nameInput = screen.getByRole('textbox', { name: 'username' }) as HTMLInputElement;
    passwordInput = screen.getByRole('textbox', { name: 'password' }) as HTMLInputElement;
    submitButton = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;
  });

  it('page composition', () => {
    expect(titleHeading).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe('submit', () => {
    test('submit works', async () => {
      userEvent.clear(nameInput);
      userEvent.type(nameInput, mockExistingUser.username);
      expect(nameInput).toHaveValue(mockExistingUser.username);

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, mockExistingUser.password);
      expect(passwordInput).toHaveValue(mockExistingUser.password);

      expect(submitButton).toBeEnabled();
      userEvent.click(submitButton);

      await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /login/i }));

      const taskPageHeading = await screen.findByRole('heading', { name: /todo/i });
      expect(taskPageHeading).toBeInTheDocument();
    });
  });
});
