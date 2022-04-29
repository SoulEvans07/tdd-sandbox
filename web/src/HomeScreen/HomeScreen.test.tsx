import { render, screen } from '@testing-library/react';
import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  test('renders white title link', () => {
    render(<HomeScreen />);
    const titleElement = screen.getByRole('link', { name: /home/i });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle({ color: 'white' });
  });
});
