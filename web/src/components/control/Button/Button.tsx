import { DetailedHTMLProps, ButtonHTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import './Button.scss';

type HtmlButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export interface ButtonProps extends HtmlButtonProps {
  size?: 'small' | 'big' | 'wide';
  fill?: 'fill' | 'border' | 'text';
  color?: 'primary'; // | 'error';
  active?: boolean;
}

export function Button(props: ButtonProps): ReactElement {
  const { size, fill = 'fill', color, children, className, active, ...restProps } = props;

  return (
    <button className={classNames(className, 'button', size, fill, color, { active })} {...restProps}>
      {children}
    </button>
  );
}
