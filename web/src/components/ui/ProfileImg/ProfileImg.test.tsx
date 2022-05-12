import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileImg } from './ProfileImg';

describe('ProfileImg', () => {
  describe('fallback', () => {
    test('fallback when there is no image src provided', () => {
      const username = 'abcdefg';
      render(<ProfileImg username={username} />);

      const firstLetter = screen.getByText(username[0]);
      expect(firstLetter).toBeInTheDocument();
    });

    test('onClick works', () => {
      const onClick = jest.fn();
      render(<ProfileImg username="asf" onClick={onClick} />);

      const firstLetter = screen.getByText('a');
      userEvent.click(firstLetter);
      expect(onClick).toBeCalled();
    });
  });

  describe('image', () => {
    test('shows image if img src is provided', () => {
      const username = 'abcdefg';
      render(<ProfileImg username={username} img={`${username}.png`} />);

      const image = screen.getByRole('img', { name: /profile/i });
      expect(image).toBeInTheDocument();
    });

    test('onClick works', () => {
      const onClick = jest.fn();
      render(<ProfileImg username="asdf" img="asdf.png" onClick={onClick} />);

      const image = screen.getByRole('img', { name: /profile/i });
      userEvent.click(image);
      expect(onClick).toBeCalled();
    });
  });
});
