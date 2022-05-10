import { ReactElement } from 'react';
import ProfileImg from '../ProfileImg/ProfileImg';
import './NameTag.scss';

interface NameTagProps {
  name: string;
  img: string;
}

export default function NameTag(props: NameTagProps): ReactElement {
  const { name, img } = props;
  return (
    <div className="name-tag">
      <ProfileImg username={name} img={img} />
      <span className="name">{name}</span>
    </div>
  );
}
