import { render, screen } from '@testing-library/react';
import { Page } from './Page/Page';
import { Footer } from './Footer/Footer';
import { Dropdown } from './Dropdown/Dropdown';
import { SidePanel } from './SidePanel/SidePanel';
import userEvent from '@testing-library/user-event';

describe.each([
  { title: 'Page', Layout: Page },
  { title: 'Footer', Layout: Footer },
  { title: 'Dropdown', Layout: Dropdown },
  { title: 'SidePanel', Layout: SidePanel },
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

      const button = screen.getByRole('button', { name: 'OK' });
      expect(button).toBeInTheDocument();
    });
  });
});

describe('SidePanel', () => {
  it('has a close button', () => {
    const onClose = jest.fn();
    render(<SidePanel onClose={onClose} />);

    const close = screen.getByRole('button', { name: 'Close' });
    userEvent.click(close);
    expect(onClose).toBeCalled();
  });
});
