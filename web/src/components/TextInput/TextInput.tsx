import { HTMLProps, ReactElement } from 'react';
import './TextInput.scss';

export interface TextInputProps extends Omit<HTMLProps<HTMLInputElement>, 'role'> {
  type?: 'text' | 'password';
}

export default function TextInput(props: TextInputProps): ReactElement {
  const { type = 'text', id, title, ...restProps } = props;

  return <input className="text-input" {...restProps} name={id} title={title || id} type={type} role="textbox" />;
}
