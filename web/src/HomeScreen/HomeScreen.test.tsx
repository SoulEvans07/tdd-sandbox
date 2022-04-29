import { prettyDOM, render, screen } from '@testing-library/react';
import { HomeScreen } from './HomeScreen';

test('renders title link', () => {
  render(<HomeScreen />);
  const titleElement = screen.getByRole('link', { name: /home/i });
  expect(titleElement).toBeInTheDocument();

  console.log(prettyDOM(titleElement));
  // expect(titleElement).toHaveStyle({ color: 'white' });
});
