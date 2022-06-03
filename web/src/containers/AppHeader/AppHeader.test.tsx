import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/auth/AuthContext';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { StoreData } from '../../contexts/store/types';
import { ThemeProvider } from '../../contexts/theme/ThemeContext';
import { supressErrorMessages } from '../../helpers/testHelpers';
import { mockUsers } from '../../mocks/controllers/mockData';
import { AppHeader, userProfileId } from './AppHeader';

describe('AppHeader', () => {
  supressErrorMessages();

  const title = 'TEST TITLE';
  const mockUser = mockUsers[0];
  const mockWorkspace = mockUsers[0].tenants[0];

  const setup = (init?: StoreData) => {
    render(
      <ThemeProvider initial="dark">
        <AuthProvider initial={{ currentUser: mockUser.data, token: mockUser.token }}>
          <StoreProvider initial={init}>
            <AppHeader title={title} />
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  };

  it('composition', () => {
    setup();
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /switch theme/i })).toBeInTheDocument();
    const userProfile = screen.getByTestId(userProfileId);
    expect(userProfile).toBeInTheDocument();
    expect(userProfile).toHaveAttribute('title', mockUser.data.username);
  });

  it('when profile img is clicked a menu opens with the workspaces and a logout btn', async () => {
    setup();
    const profileImg = screen.getByTestId(userProfileId);
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

    const profileImg = screen.getByTestId(userProfileId);
    userEvent.click(profileImg);

    await waitFor(async () => {
      const workspace = await screen.findByRole('option', { name: mockWorkspace.name });
      userEvent.click(workspace);

      const subheader = await screen.findByRole('heading', { name: mockWorkspace.name });
      expect(subheader).toBeInTheDocument();
    });
  });
});
