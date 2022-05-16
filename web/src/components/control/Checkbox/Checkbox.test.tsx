import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement, useState } from 'react';
import { supressErrorMessages } from '../../../helpers/testHelpers';
import { Checkbox, UncontrolledInputChangeError } from './Checkbox';

function MockControlledCheckbox(): ReactElement {
  const [state, setState] = useState(false);
  return <Checkbox checked={state} onChange={val => setState(val)} />;
}

describe('Checkbox', () => {
  describe('error handling', () => {
    supressErrorMessages();

    it('throws an error when only checked is set but not the onChange prop', () => {
      expect(() => render(<Checkbox checked={true} />)).toThrowType(UncontrolledInputChangeError);
    });

    it('throws an error when only onChange is set but not the checked prop', () => {
      expect(() => render(<Checkbox onChange={() => {}} />)).toThrowType(UncontrolledInputChangeError);
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
