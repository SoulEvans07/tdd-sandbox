import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/auth/AuthContext';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { StoreData } from '../../contexts/store/types';
import { ThemeProvider } from '../../contexts/theme/ThemeContext';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { mockJwtToken, mockUser } from '../../mocks/controllers/mockData';
import { mockWorkspace } from '../../mocks/controllers/MockUserController';
import { ROUTES } from '../../router/types';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  supressErrorMessages();

  const title = 'TEST TITLE';
  const user = {
    id: mockUser.id,
    username: mockUser.username,
    email: mockUser.email,
    tenants: mockUser.tenants,
  };
  const setup = (init?: StoreData) => {
    render(
      <MemoryRouter initialEntries={[ROUTES.TASKS]}>
        <ThemeProvider initial="dark">
          <AuthProvider initial={{ currentUser: user, token: mockJwtToken }}>
            <StoreProvider initial={init}>
              <AppHeader title={title} />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('composition', () => {
    setup();
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /switch theme/i })).toBeInTheDocument();
    expect(screen.getByTitle(user.username)).toBeInTheDocument();
  });

  it('when profile img is clicked a menu opens with the workspaces and a logout btn', async () => {
    setup();
    const profileImg = screen.getByTitle(user.username);
    userEvent.click(profileImg);

    const logout = await screen.findByRole('option', { name: /logout/i });
    expect(logout).toBeInTheDocument();

    const personal = await screen.findByRole('option', { name: /personal/i });
    expect(personal).toBeInTheDocument();

    await waitFor(
      async () => {
        const workspace = await screen.findByRole('option', { name: mockWorkspace.name });
        expect(workspace).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
    // wait until last updates are done so they dont throw error when the test unmounts the components
    await new Promise(res => setTimeout(res, 1000));
  });

  it('changes the subheader when workspace is changed', async () => {
    setup();
    expect(screen.getByRole('heading', { name: /personal/i })).toBeInTheDocument();

    const profileImg = screen.getByTitle(user.username);
    userEvent.click(profileImg);

    await waitFor(async () => {
      const workspace = await screen.findByRole('option', { name: mockWorkspace.name });
      userEvent.click(workspace);

      const subheader = await screen.findByRole('heading', { name: mockWorkspace.name });
      expect(subheader).toBeInTheDocument();
    });
  });
});
