import { MouseEvent, HTMLProps, ReactElement } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import './TextLink.scss';

interface TextLinkProps extends HTMLProps<HTMLAnchorElement> {
  color?: 'primary' | 'rainbow';
}

export default function TextLink(props: TextLinkProps): ReactElement {
  const navigate = useNavigate();
  const { color = 'primary', className, href, onClick, children, ...restProps } = props;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) return onClick(e);
    if (href) navigate(href);
  };

  return (
    <a {...restProps} className={classNames('text-link', className, color)} onClick={handleClick}>
      {children}
    </a>
  );
}
