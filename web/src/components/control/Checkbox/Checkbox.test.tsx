import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement, useState } from 'react';
import { Checkbox, UncontrolledInputChangeError } from './Checkbox';

function MockControlledCheckbox(): ReactElement {
  const [state, setState] = useState(false);
  return <Checkbox checked={state} onChange={val => setState(val)} />;
}

describe('Checkbox', () => {
  describe('error handling', () => {
    it('throws an error when only checked is set but not the onChange prop', () => {
      const spy = jest.spyOn(console, 'error');
      spy.mockImplementation(() => {});

      expect(() => render(<Checkbox checked={true} />)).toThrowType(UncontrolledInputChangeError);

      spy.mockRestore();
    });

    it('throws an error when only onChange is set but not the checked prop', () => {
      const spy = jest.spyOn(console, 'error');
      spy.mockImplementation(() => {});

      expect(() => render(<Checkbox onChange={() => {}} />)).toThrowType(UncontrolledInputChangeError);

      spy.mockRestore();
    });
  });

  describe.each([
    { title: 'uncontrolled', component: <Checkbox /> },
    { title: 'controlled', component: <MockControlledCheckbox /> },
  ])('controlled/uncontrolled', ({ title, component }) => {
    describe(`${title} version`, () => {
      it('should swtich state when clicked', () => {
        render(component);
        const checkboxEl = screen.getByRole('checkbox');
        expect(checkboxEl).not.toBeChecked();

        userEvent.click(checkboxEl);
        expect(checkboxEl).toBeChecked();
      });
    });
  });
});
