import { ReactElement } from 'react';
import classNames from 'classnames';
import './SidePanel.scss';
import { Icon } from '../../ui/Icon/Icon';

interface SidePanelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  onClose?: VoidFunction;
}

export function SidePanel(props: SidePanelProps): ReactElement {
  const { onClose, className, children, hidden, ...restProps } = props;

  return (
    <aside {...restProps} className={classNames('side-panel', className)} hidden={!!hidden}>
      <header>
        <Icon icon="cross" className="close-panel" onClick={onClose} aria-label="Close" role="button" />
      </header>
      {children}
    </aside>
  );
}
