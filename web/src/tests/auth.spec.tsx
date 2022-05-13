import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mockExistingUser } from '../mocks/controllers/MockAuthController';
import { ROUTES } from '../router/types';
import App from '../App';

describe('login behavior', () => {
  let titleHeading: HTMLHeadingElement;
  let nameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
        <App />
      </MemoryRouter>
    );

    titleHeading = screen.getByRole('heading', { name: /login/i }) as HTMLHeadingElement;
    nameInput = screen.getByRole('textbox', { name: 'username' }) as HTMLInputElement;
    passwordInput = screen.getByRole('textbox', { name: 'password' }) as HTMLInputElement;
    submitButton = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it('page composition', () => {
    expect(titleHeading).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe('submit', () => {
    test('login and logout works', async () => {
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

      const profileImg = screen.getByTitle(mockExistingUser.username);
      expect(profileImg).toBeInTheDocument();
      userEvent.click(profileImg);

      const logoutOption = screen.getByRole('option', { name: /logout/i });
      userEvent.click(logoutOption);

      const loginPageHeading = await screen.findByRole('heading', { name: /login/i });
      expect(loginPageHeading).toBeInTheDocument();

      // wait until last updates are done so they dont throw error when the test unmounts the components
      await new Promise(res => setTimeout(res, 1000));
    });
  });
});
