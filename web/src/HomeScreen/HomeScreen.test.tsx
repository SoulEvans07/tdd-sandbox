import { render, screen } from '@testing-library/react';
import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  describe('mock', () => {
    it('returns mock response', async () => {
      render(<HomeScreen />);
      const messageText = await screen.findByText('Message: ', { exact: false });
      expect(messageText).toHaveTextContent('hello world');
    });
  });
});
