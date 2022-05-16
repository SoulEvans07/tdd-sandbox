import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { mockExistingUser } from '../../mocks/controllers/MockAuthController';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { LoginScreen } from './LoginScreen';
import { AuthProvider } from '../../contexts/auth/AuthContext';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { ThemeProvider } from '../../contexts/theme/ThemeContext';
import { ROUTES } from '../../router/types';
import { AppHeader } from '../../containers/AppHeader/AppHeader';

describe('LoginScreen', () => {
  let titleHeading: HTMLHeadingElement;
  let nameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  supressErrorMessages();

  function MockApp() {
    const navigate = useNavigate();
    const onLogout = () => navigate(ROUTES.LOGIN);
    return (
      <ThemeProvider initial="dark">
        <AuthProvider initial={{ currentUser: undefined, token: undefined }} onLogout={onLogout}>
          <StoreProvider>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
              <Route path={ROUTES.TASKS} element={<AppHeader title="Todo" />} />
            </Routes>
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
        <MockApp />
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
