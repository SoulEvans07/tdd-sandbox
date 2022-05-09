import { HTMLProps, PropsWithChildren, ReactElement } from 'react';
import classNames from 'classnames';
import './Page.scss';

type PageProps = HTMLProps<HTMLDivElement>;

export default function Page(props: PropsWithChildren<PageProps>): ReactElement {
  const { children, className, ...restProps } = props;

  return (
    <div className={classNames('page', className)} {...restProps}>
      {children}
    </div>
  );
}
