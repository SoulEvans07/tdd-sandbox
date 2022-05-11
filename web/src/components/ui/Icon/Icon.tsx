import React, { ReactElement, SVGProps, useEffect, useState } from 'react';
import classNames from 'classnames';

type ReactSVG = React.FC<SVGProps<SVGSVGElement>>;

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: string;
}

export function Icon(props: IconProps): ReactElement {
  const { icon, className, ...restProps } = props;
  const [SVGIcon, setIcon] = useState<ReactSVG | null>(null);
  const newClassName = classNames('icon', className);

  useEffect(() => {
    // https://stackoverflow.com/questions/61339259/how-to-dynamically-import-svg-and-render-it-inline
    import(`!!@svgr/webpack?-svgo,+titleProp,+ref!./svg/${icon}.svg`)
      .then(svg => setIcon(svg.default as unknown as ReactSVG))
      .catch(_ => setIcon(null));
  }, [icon]);

  if (!SVGIcon) return <IconFallback className={newClassName} {...restProps} />;

  return <SVGIcon className={newClassName} {...restProps} />;
}

function IconFallback(props: SVGProps<SVGSVGElement>): ReactElement {
  const { className, ...restProps } = props;
  return <svg width={18} height={18} className={classNames('svg-not-found', className)} {...restProps} />;
}
