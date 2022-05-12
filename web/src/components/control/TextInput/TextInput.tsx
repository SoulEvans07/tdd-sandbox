import { ReactElement } from 'react';
import classNames from 'classnames';
import './TextInput.scss';
import { TextInputProps } from './types';

export function TextInput(props: TextInputProps): ReactElement {
  const { type = 'text', id, title, className, ...restProps } = props;

  return (
    <input
      {...restProps}
      className={classNames('text-input', className)}
      name={id}
      title={title || id}
      type={type}
      role="textbox"
    />
  );
}
