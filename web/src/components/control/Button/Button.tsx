import { DetailedHTMLProps, ButtonHTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import './Button.scss';

type HtmlButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
interface ButtonProps extends HtmlButtonProps {
  size?: 'small' | 'big' | 'wide';
  fill?: 'fill' | 'border' | 'text';
  color?: 'primary'; // | 'error';
}

export default function Button(props: ButtonProps): ReactElement {
  const { size, fill = 'fill', color, children, className, ...restProps } = props;

  return (
    <button className={classNames(className, 'button', size, fill, color)} {...restProps}>
      {children}
    </button>
  );
}
