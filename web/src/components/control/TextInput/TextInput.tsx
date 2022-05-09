import { HTMLProps, ReactElement } from 'react';
import classNames from 'classnames';
import './TextInput.scss';

export interface TextInputProps extends Omit<HTMLProps<HTMLInputElement>, 'role'> {
  type?: 'text' | 'password';
}

export default function TextInput(props: TextInputProps): ReactElement {
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
