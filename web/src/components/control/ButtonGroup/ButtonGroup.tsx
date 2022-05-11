import { PropsWithChildren, ReactElement, useMemo } from 'react';
import classNames from 'classnames';
import './ButtonGroup.scss';
import { Button, ButtonProps } from '../Button/Button';

interface ButtonGroupProps {
  buttons: ButtonProps[];
  className?: string;
  size?: ButtonProps['size'];
  fill?: ButtonProps['fill'];
  color?: ButtonProps['color'];
}

export function ButtonGroup(props: PropsWithChildren<ButtonGroupProps>): ReactElement {
  const { className, buttons, size, fill, color } = props;

  const buttonList = useMemo(() => {
    return buttons.map(btn => {
      return { ...btn, size: size || btn.size, fill: fill || btn.fill, color: color || btn.color };
    });
  }, [buttons, size, fill, color]);

  return (
    <div className={classNames('button-group', className, size, fill, color)}>
      {buttonList.map((buttonProps, idx) => (
        <Button key={`button-${idx}`} {...buttonProps} />
      ))}
    </div>
  );
}
