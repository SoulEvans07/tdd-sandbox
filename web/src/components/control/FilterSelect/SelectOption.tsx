import { PropsWithChildren, ReactElement, useMemo } from 'react';
import classNames from 'classnames';
import { stopPropagation } from '../../../helpers/eventHelpers';
import { HTMLDivProps } from '../../../types/common';
import { useSelect } from './SelectContext';

interface SelectOptionProps extends Omit<HTMLDivProps, 'onClick'> {
  value: string;
}

export function SelectOption(props: PropsWithChildren<SelectOptionProps>): ReactElement {
  const { value, className, children, ...restProps } = props;
  const { selected, setSelected } = useSelect();

  const isSelected = useMemo(() => selected === value, [selected, value]);
  const handleClick = stopPropagation(() => setSelected(value));

  return (
    <div
      className={classNames('select-option', className, { selected: isSelected })}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
      aria-label={value}
      {...restProps}
      data-value={value}
    >
      {children}
    </div>
  );
}

export type SelectOptionComp = ReactElement<PropsWithChildren<SelectOptionProps>>;
