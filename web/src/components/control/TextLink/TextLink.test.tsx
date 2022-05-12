import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TextLink } from './TextLink';

describe('TextLink', () => {
  it('navigates to given href when clicked', () => {
    const linkText = 'Go to Finish';
    const finishText = 'Finish';

    render(
      <MemoryRouter initialEntries={['/start']}>
        <Routes>
          <Route path="/start" element={<TextLink href="/finish">{linkText}</TextLink>} />
          <Route path="/finish" element={<div>{finishText}</div>} />
        </Routes>
      </MemoryRouter>
    );

    const noFinish = screen.queryByText(finishText);
    expect(noFinish).not.toBeInTheDocument();

    const link = screen.getByRole('link');
    userEvent.click(link);

    const finishLine = screen.getByText(finishText);
    expect(finishLine).toBeInTheDocument();
  });
});
