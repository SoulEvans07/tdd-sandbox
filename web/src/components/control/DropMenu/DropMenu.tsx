import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useCallback } from 'react';
import classNames from 'classnames';
import './DropMenu.scss';
import { Dropdown } from '../../layout/Dropdown/Dropdown';
import { PropsWithTypedChildren } from '../../../types/common';

interface DropMenuData {
  open?: boolean;
  onSelect?: VoidFunction;
  selectedId?: string;
}

type DropMenuProps = PropsWithTypedChildren<DropMenuData, ReactNode>;

export function DropMenu(props: DropMenuProps): ReactElement {
  const { open, onSelect, selectedId, children } = props;

  const StyledChildren = useCallback(() => {
    if (!children) return <></>;

    return (
      <>
        {Children.map(children, child => {
          if (!isValidElement(child)) return child;
          if (child.type === 'hr') return child;

          const selected = selectedId !== undefined ? { 'aria-selected': selectedId === child.props.id } : {};
          return cloneElement(child, {
            className: classNames(child.props.className, 'option-item'),
            role: 'option',
            ...selected,
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
