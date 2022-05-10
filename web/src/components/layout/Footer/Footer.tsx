import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
import './Footer.scss';

type FooterProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export default function Footer(props: FooterProps): ReactElement {
  const { children, ...restProps } = props;
  return <footer {...restProps}>{children}</footer>;
}
