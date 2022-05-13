import { Children, cloneElement, ReactElement, useCallback } from 'react';
import classNames from 'classnames';
import './DropMenu.scss';
import { Dropdown } from '../../layout/Dropdown/Dropdown';
import { PropsWithTypedChildren } from '../../../types/common';

interface DropMenuData {
  open?: boolean;
  onSelect?: VoidFunction;
}

type DropMenuProps = PropsWithTypedChildren<DropMenuData, ReactElement>;

export function DropMenu(props: DropMenuProps): ReactElement {
  const { open, onSelect, children } = props;

  const StyledChildren = useCallback(() => {
    if (!children) return <></>;
    return (
      <>
        {Children.map(children, (child: ReactElement) => {
          return cloneElement(child, {
            className: classNames(child.props.className, 'option-item'),
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
    <Dropdown className="drop-menu" hidden={!open}>
      <StyledChildren />
    </Dropdown>
  );
}
