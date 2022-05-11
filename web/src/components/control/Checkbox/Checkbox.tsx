import { ReactElement } from 'react';
import './Checkbox.scss';
import { Icon } from '../../ui/Icon/Icon';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps): ReactElement {
  const { checked, onChange } = props;

  const handleChange = () => onChange?.(!checked);

  return (
    <div className="checkbox" role="checkbox" aria-checked={checked} onClick={handleChange}>
      {!!checked && <Icon icon="check" />}
    </div>
  );
}
