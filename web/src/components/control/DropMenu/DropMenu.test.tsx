import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropMenu } from './DropMenu';

describe('DropMenu', () => {
  const setup = (isOpen: boolean) => {
    render(
      <DropMenu open={isOpen} onSelect={jest.fn()} selectedId="set">
        <span>Profile</span>
        <span className="collide" id="set">
          Settings
        </span>
        <hr data-testid="hr" />
        <span id="log">Logout</span>
      </DropMenu>
    );
  };

  it('starts as not visible', () => {
    setup(false);
    const profile = screen.getByText(/profile/i);
    expect(profile).not.toBeVisible();

    const settings = screen.getByText(/settings/i);
    expect(settings).not.toBeVisible();

    const hr = screen.getByTestId('hr');
    expect(hr).not.toBeVisible();

    const logout = screen.getByText(/logout/i);
    expect(logout).not.toBeVisible();
  });

  it('opens when flag is set', () => {
    setup(true);

    const profile = screen.getByText(/profile/i);
    expect(profile).toBeVisible();

    const settings = screen.getByText(/settings/i);
    expect(settings).toBeVisible();

    const hr = screen.getByTestId('hr');
    expect(hr).toBeVisible();

    const logout = screen.getByText(/logout/i);
    expect(logout).toBeVisible();
  });

  it('adds option-item class to all children', () => {
    setup(true);

    const profile = screen.getByText(/profile/i);
    expect(profile).toHaveClass('option-item');

    const settings = screen.getByText(/settings/i);
    expect(settings).toHaveClass('option-item', 'collide');

    const hr = screen.getByTestId('hr');
    expect(hr).not.toHaveClass('option-item');

    const logout = screen.getByText(/logout/i);
    expect(logout).toHaveClass('option-item');
  });

  it('aria-selected="true" to child with the selectedId', () => {
    setup(true);

    const profile = screen.getByText(/profile/i);
    expect(profile).toHaveAttribute('aria-selected', 'false');

    const settings = screen.getByText(/settings/i);
    expect(settings).toHaveAttribute('aria-selected', 'true');

    const hr = screen.getByTestId('hr');
    expect(hr).not.toHaveAttribute('aria-selected');

    const logout = screen.getByText(/logout/i);
    expect(logout).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onClose if any child is clicked', () => {
    const onSelect = jest.fn();
    const onProfile = jest.fn();
    render(
      <DropMenu open onSelect={onSelect}>
        <span onClick={onProfile}>Profile</span>
        <span className="collide">Settings</span>
        <hr data-testid="hr" />
        <span>Logout</span>
      </DropMenu>
    );

    const settings = screen.getByText(/settings/i);
    userEvent.click(settings);
    expect(onSelect).toBeCalledTimes(1);

    const profile = screen.getByText(/profile/i);
    userEvent.click(profile);
    expect(onProfile).toBeCalledTimes(1);
    expect(onSelect).toBeCalledTimes(2);
  });
});
