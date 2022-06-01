import { ReactElement } from 'react';
import classNames from 'classnames';
import './NameTag.scss';
import { ProfileImg } from '../ProfileImg/ProfileImg';

interface NameTagProps {
  name?: string;
  img?: string;
}

export function NameTag(props: NameTagProps): ReactElement {
  const { name, img } = props;
  const unassigned = !name;

  return (
    <div className={classNames('name-tag', { unassigned })}>
      {!!name && <ProfileImg username={name} img={img} />}
      {!name && <ProfileImg username="" img="img/default-avatar.png" />}
      <span className="name">{name || 'Unassigned'}</span>
    </div>
  );
}
