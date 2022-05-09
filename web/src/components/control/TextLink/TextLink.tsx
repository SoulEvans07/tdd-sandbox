import classNames from 'classnames';
import { HTMLProps, ReactElement } from 'react';
import './TextLink.scss';

interface TextLinkProps extends HTMLProps<HTMLAnchorElement> {
  color?: 'primary' | 'rainbow';
}

export default function TextLink(props: TextLinkProps): ReactElement {
  const { color = 'primary', className, children, ...restProps } = props;
  return (
    <a className={classNames('text-link', className, color)} {...restProps}>
      {children}
    </a>
  );
}
