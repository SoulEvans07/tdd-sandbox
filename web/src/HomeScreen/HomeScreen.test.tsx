import { render, screen } from '@testing-library/react';
import { HomeScreen } from './HomeScreen';

test('renders title', () => {
  render(<HomeScreen />);
  const titleElement = screen.getByText(/home/i);
  expect(titleElement).toBeInTheDocument();
});
