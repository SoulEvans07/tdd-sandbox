import { ReactElement, CSSProperties, useMemo } from 'react';
import classNames from 'classnames';
import './ProfileImg.scss';
import { textToHue } from '../../../helpers/stringToColor';

interface ProfileImgProps {
  img?: string;
  username: string;
  className?: string;
  onClick?: VoidFunction;
}

export function ProfileImg(props: ProfileImgProps): ReactElement {
  const { username, className, onClick } = props;

  const hue = useMemo(() => textToHue(username), [username]);
  const colors = {
    '--color-dark': `hsl(${hue}, 45%, 50%)`,
    '--color-light': `hsl(${hue}, 80%, 95%)`,
  } as CSSProperties;

  return (
    <span className={classNames('profile-img', className)} title={username} style={colors} onClick={onClick}>
      {username[0]}
    </span>
  );
}
