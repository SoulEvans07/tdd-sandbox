import { render, screen } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  const inputId = 'test-input-id';
  const testTitle = 'Test Title';

  it('has the same name as the id', () => {
    render(<TextInput id={inputId} />);
    const inputElem = screen.getByRole('textbox');
    expect(inputElem).toHaveAttribute('name', inputId);
  });

  it('has the same title as the id if no title was provided', () => {
    render(<TextInput id={inputId} />);
    const inputElem = screen.getByRole('textbox');
    expect(inputElem).toHaveAttribute('title', inputId);
  });

  it('title can be set', () => {
    render(<TextInput title={testTitle} />);
    const inputElem = screen.getByRole('textbox');
    expect(inputElem).toHaveAttribute('title', testTitle);
  });

  it('does not have the same title as the id if title was provided', () => {
    expect(inputId).not.toBe(testTitle);

    render(<TextInput id={inputId} title={testTitle} />);
    const inputElem = screen.getByRole('textbox');
    expect(inputElem).toHaveAttribute('title', testTitle);
  });
});
