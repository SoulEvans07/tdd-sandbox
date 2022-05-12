import { ReactElement, useState } from 'react';
import './TextInput.scss';
import { PasswordInputProps } from './types';
import { TextInput } from './TextInput';
import { Icon } from '../../ui/Icon/Icon';

export function PasswordInput(props: PasswordInputProps): ReactElement {
  const { enableShow, ...restProps } = props;

  const [visible, setVisible] = useState(false);
  const switchVisiblity = () => setVisible(prev => !prev);

  return (
    <div className="password-input-container">
      <TextInput {...restProps} type={visible ? 'text' : 'password'} />
      {enableShow && (
        <div className="visibility-switch" onClick={switchVisiblity} role="button" aria-label="Visibility switch">
          {visible ? <Icon icon="eye-slash" /> : <Icon icon="eye" />}
        </div>
      )}
    </div>
  );
}
