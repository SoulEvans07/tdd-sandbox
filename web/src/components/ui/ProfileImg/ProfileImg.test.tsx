import { render, screen } from '@testing-library/react';
import ProfileImg from './ProfileImg';

describe('ProfileImg', () => {
  test('fallback when there is no image src provided', () => {
    const username = 'abcdefg';
    render(<ProfileImg username={username} />);

    const firstLetter = screen.getByText(username[0]);
    expect(firstLetter).toBeInTheDocument();
  });
});
