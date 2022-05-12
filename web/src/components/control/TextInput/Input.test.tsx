import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './PasswordInput';
import { TextInput } from './TextInput';
import { ValidatedInput } from './ValidatedInput';

describe('Input', () => {
  const inputId = 'test-input-id';
  const testTitle = 'Test Title';
  const text = 'text' as const;
  const password = 'password' as const;

  describe.each([
    { title: 'TextInput[type="text"]', Input: TextInput, props: { type: text } },
    { title: 'TextInput[type="password"]', Input: TextInput, props: { type: password } },
    { title: 'PasswordInput', Input: PasswordInput, props: {} },
  ])('variants', ({ title, Input, props }) => {
    describe(`${title} variant`, () => {
      it('has the same name as the id', () => {
        render(<Input id={inputId} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('name', inputId);
      });

      it('has the same title as the id if no title was provided', () => {
        render(<Input id={inputId} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('title', inputId);
      });

      it('title can be set', () => {
        render(<Input title={testTitle} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('title', testTitle);
      });

      it('does not have the same title as the id if title was provided', () => {
        expect(inputId).not.toBe(testTitle);

        render(<Input id={inputId} title={testTitle} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('title', testTitle);
      });
    });
  });

  // TODO: find a way to fix the type issue and merge this with the other describe.each @adam.szi
  describe.each([
    { title: 'ValidatedInput[type="text"]', Input: ValidatedInput, props: { Input: TextInput } },
    { title: 'ValidatedInput[type="password"]', Input: ValidatedInput, props: { Input: PasswordInput } },
  ])('validated variants', ({ title, Input, props }) => {
    describe(`${title} variant`, () => {
      it('has the same name as the id', () => {
        render(<Input id={inputId} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('name', inputId);
      });

      it('has the same title as the id if no title was provided', () => {
        render(<Input id={inputId} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('title', inputId);
      });

      it('title can be set', () => {
        render(<Input title={testTitle} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('title', testTitle);
      });

      it('does not have the same title as the id if title was provided', () => {
        expect(inputId).not.toBe(testTitle);

        render(<Input id={inputId} title={testTitle} {...props} />);
        const inputElem = screen.getByRole('textbox');
        expect(inputElem).toHaveAttribute('title', testTitle);
      });
    });
  });

  describe('PasswordInput', () => {
    it('should not show the visiblity switch by default', () => {
      render(<PasswordInput />);
      const noSwitch = screen.queryByRole('button', { name: /visibility switch/i });
      expect(noSwitch).not.toBeInTheDocument();
    });

    it('makes the password visible when switch is clicked', () => {
      render(<PasswordInput enableShow />);
      const passwordInput = screen.getByRole('textbox');
      expect(passwordInput).toHaveAttribute('type', 'password');

      const visibilitySwitch = screen.getByRole('button', { name: /visibility switch/i });
      expect(visibilitySwitch).toBeInTheDocument();

      userEvent.click(visibilitySwitch);
      expect(passwordInput).toHaveAttribute('type', 'text');

      userEvent.click(visibilitySwitch);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('ValidatedInput', () => {
    const message = 'Too short';
    const minLength = (min: number) => (value: string) => value.length < min ? message : null;

    it('shows no error when there is no validator given', () => {
      render(<ValidatedInput Input={TextInput} />);
      const noError = screen.queryByRole('alert');
      expect(noError).not.toBeInTheDocument();
    });

    it('shows no error without the input getting focus', () => {
      render(<ValidatedInput Input={TextInput} validator={minLength(4)} />);
      const noError = screen.queryByRole('alert');
      expect(noError).not.toBeInTheDocument();

      const input = screen.getByRole('textbox');
      userEvent.click(input);
      const validationAlert = screen.getByRole('alert');
      expect(validationAlert).toBeInTheDocument();
    });

    it('shows an error when the validation fails', () => {
      const min = 5;
      render(<ValidatedInput Input={TextInput} validator={minLength(min)} />);

      const input = screen.getByRole('textbox');
      userEvent.type(input, 'a'.repeat(min - 1));

      const validationAlert = screen.getByRole('alert');
      expect(validationAlert).toBeInTheDocument();
      expect(validationAlert).toHaveTextContent(message);

      userEvent.type(input, 'a'.repeat(min));
      const noError = screen.queryByRole('alert');
      expect(noError).not.toBeInTheDocument();
    });
  });
});
