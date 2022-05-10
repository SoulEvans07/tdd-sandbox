import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
import './Footer.scss';

type FooterProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export function Footer(props: FooterProps): ReactElement {
  const { children, ...restProps } = props;
  return <footer {...restProps}>{children}</footer>;
}
