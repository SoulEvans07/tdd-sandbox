import { ReactElement, useMemo, useState } from 'react';
import './Checkbox.scss';
import { Icon } from '../../ui/Icon/Icon';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps): ReactElement {
  const { checked, onChange } = props;
  const [_checked, setChecked] = useState(false);

  if ((checked === undefined && onChange !== undefined) || (checked !== undefined && onChange === undefined)) {
    throw new UncontrolledInputChangeError();
  }

  const handleChange = () => {
    if (onChange) return onChange(!checked);
    setChecked(prev => !prev);
  };

  const value = useMemo(() => (checked !== undefined ? checked : _checked), [checked, _checked]);

  return (
    <div className="checkbox" role="checkbox" aria-checked={value} onClick={handleChange}>
      {!!value && <Icon icon="check" />}
    </div>
  );
}

export class UncontrolledInputChangeError extends Error {
  name = 'UncontrolledInputChangeError';
  message =
    'A component is changing an uncontrolled Checkbox. Checkbox elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component.';
}
