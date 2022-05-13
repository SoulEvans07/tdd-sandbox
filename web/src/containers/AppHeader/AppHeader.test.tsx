import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockWorkspace } from '../../mocks/controllers/MockUserController';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { StoreProvider } from '../../contexts/store/StoreContext';
import { StoreData } from '../../contexts/store/types';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { mockJwtToken } from '../../mocks/controllers/mockData';
import { ROUTES } from '../../router/types';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  const title = 'TEST TITLE';
  const user = {
    id: 0,
    username: 'adam.szi',
    email: 'adam.szi@snapsoft.hu',
    tenants: [mockWorkspace.id],
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
    expect(screen.getByRole('checkbox', { name: /switch theme/i })).toBeInTheDocument();
    expect(screen.getByTitle(user.username)).toBeInTheDocument();
  });

  it('when profile img is clicked a menu opens with the workspaces and a logout btn', () => {
    setup();
    const profileImg = screen.getByTitle(user.username);
    userEvent.click(profileImg);

    expect(screen.getByRole('option', { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: mockWorkspace.name })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /logout/i })).toBeInTheDocument();
  });
});
