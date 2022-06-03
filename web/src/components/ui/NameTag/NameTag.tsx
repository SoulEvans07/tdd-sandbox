import { ReactElement } from 'react';
import classNames from 'classnames';
import './NameTag.scss';
import { ProfileImg } from '../ProfileImg/ProfileImg';

interface NameTagProps {
  name: string;
  img?: string;
}

export function NameTag(props: NameTagProps): ReactElement {
  const { name, img } = props;
  const unassigned = !name;

  return (
    <div className={classNames('name-tag', { unassigned })}>
      <ProfileImg username={name} img={img} />
      <span className="name">{name}</span>
    </div>
  );
}
