import { ReactElement } from 'react';
import classNames from 'classnames';
import './SidePanel.scss';
import { Icon } from '../../ui/Icon/Icon';

interface SidePanelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  onClose?: VoidFunction;
  label?: string;
}

export function SidePanel(props: SidePanelProps): ReactElement {
  const { label, onClose, className, children, hidden, ...restProps } = props;

  const closeLabel = 'Close' + (label ? ` ${label}` : '');

  return (
    <aside {...restProps} className={classNames('side-panel', className)} hidden={!!hidden} aria-label={label}>
      <header>
        <Icon icon="cross" className="close-panel" onClick={onClose} aria-label={closeLabel} role="button" />
      </header>
      {children}
    </aside>
  );
}
