import { ReactElement, CSSProperties, useMemo } from 'react';
import classNames from 'classnames';
import './ProfileImg.scss';
import { textToHue } from '../../../helpers/color';
import { TestProps } from '../../../types/common';

interface ProfileImgProps extends TestProps {
  img?: string;
  username: string;
  className?: string;
  onClick?: VoidFunction;
}

export function ProfileImg(props: ProfileImgProps): ReactElement {
  const { img, username, className, onClick, ...restProps } = props;

  const hue = useMemo(() => textToHue(username), [username]);
  const colors = {
    '--color-dark': `hsl(${hue}, 45%, 50%)`,
    '--color-light': `hsl(${hue}, 80%, 95%)`,
  } as CSSProperties;

  if (!img) {
    return (
      <span
        className={classNames('profile-img', 'placeholder', className)}
        title={username}
        style={colors}
        onClick={onClick}
        {...restProps}
      >
        {username[0]}
      </span>
    );
  }

  return (
    <img
      src={img}
      className={classNames('profile-img', className)}
      alt={`${username}'s profile`}
      title={username}
      onClick={onClick}
      {...restProps}
    />
  );
}
