import { HTMLProps, PropsWithChildren, ReactElement } from 'react';
import classNames from 'classnames';
import './Dropdown.scss';

interface DropdownProps extends HTMLProps<HTMLDivElement> {}

export function Dropdown(props: PropsWithChildren<DropdownProps>): ReactElement {
  const { className, children, hidden, ...restProps } = props;

  return (
    <div {...restProps} className={classNames('dropdown', className)} hidden={!!hidden}>
      {children}
    </div>
  );
}
