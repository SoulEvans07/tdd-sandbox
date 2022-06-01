import { ReactElement, SyntheticEvent, useMemo, useState } from 'react';
import './Checkbox.scss';
import { Icon } from '../../ui/Icon/Icon';
import classNames from 'classnames';

type HTMLCheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
type ToRemove = 'checked' | 'onChange' | 'onClick' | 'aria-checked' | 'role' | 'value';

interface CheckboxProps extends Omit<HTMLCheckboxProps, ToRemove> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps): ReactElement {
  const { checked, onChange, className, ...restProps } = props;
  const [_checked, setChecked] = useState(false);

  if ((checked === undefined && onChange !== undefined) || (checked !== undefined && onChange === undefined)) {
    throw new UncontrolledInputChangeError();
  }

  const handleChange = (event: SyntheticEvent) => {
    event.stopPropagation();
    if (onChange) return onChange(!checked);
    setChecked(prev => !prev);
  };

  const value = useMemo(() => (checked !== undefined ? checked : _checked), [checked, _checked]);

  return (
    <div
      className={classNames('checkbox', className)}
      role="checkbox"
      aria-checked={value}
      onClick={handleChange}
      {...restProps}
    >
      {!!value && <Icon icon="check" />}
    </div>
  );
}

export class UncontrolledInputChangeError extends Error {
  name = 'UncontrolledInputChangeError';
  message =
    'A component is changing an uncontrolled Checkbox. Checkbox elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component.';
}
