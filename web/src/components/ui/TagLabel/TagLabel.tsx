import { ReactElement } from 'react';
import classNames from 'classnames';
import './TagLabel.scss';

interface TagLabelProps {
  name: string;
  color: 'green' | 'red' | 'purple' | 'grey';
  className?: string;
}

export function TagLabel(props: TagLabelProps): ReactElement {
  const { name, color, className } = props;
  return <span className={classNames('tag-label', color, className)}>{name}</span>;
}
