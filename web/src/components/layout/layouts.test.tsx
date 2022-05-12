import { Page } from './Page/Page';
import { Footer } from './Footer/Footer';
import { render, screen } from '@testing-library/react';

describe.each([
  { title: 'Page', Layout: Page },
  { title: 'Footer', Layout: Footer },
])('layouts', ({ title, Layout }) => {
  describe(`layout ${title}`, () => {
    it('should render all children', () => {
      render(
        <Layout>
          <p>Some text</p>
          <input type="text" />
          <button>OK</button>
        </Layout>
      );

      const p = screen.getByText('Some text');
      expect(p).toBeInTheDocument();

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});