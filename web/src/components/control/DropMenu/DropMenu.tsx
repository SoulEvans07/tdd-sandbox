import { Children, cloneElement, ReactElement, useCallback } from 'react';
import classNames from 'classnames';
import './DropMenu.scss';
import { Dropdown } from '../../layout/Dropdown/Dropdown';
import { PropsWithTypedChildren } from '../../../types/common';

interface DropMenuData {
  open?: boolean;
  onSelect?: VoidFunction;
  selectedId?: string;
}

type DropMenuProps = PropsWithTypedChildren<DropMenuData, ReactElement>;

export function DropMenu(props: DropMenuProps): ReactElement {
  const { open, onSelect, selectedId, children } = props;

  const StyledChildren = useCallback(() => {
    if (!children) return <></>;
    return (
      <>
        {Children.map(children, (child: ReactElement) => {
          if (child.type === 'hr') return child;

          return cloneElement(child, {
            className: classNames(child.props.className, 'option-item'),
            role: 'option',
            'aria-selected': selectedId === child.props.id,
            onClick: () => {
              child.props.onClick?.();
              onSelect?.();
            },
          });
        })}
      </>
    );
  }, [children]);

  return (
    <Dropdown className="drop-menu" hidden={!open} role="listbox">
      <StyledChildren />
    </Dropdown>
  );
}
