import React, { ReactElement, SVGProps, useEffect, useState } from 'react';
import classNames from 'classnames';

type ReactSVG = React.FC<SVGProps<SVGSVGElement>>;

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: string;
}

export function Icon(props: IconProps): ReactElement {
  const { icon, className, ...restProps } = props;
  const [SVGIcon, setIcon] = useState<ReactSVG>();

  useEffect(() => {
    // https://stackoverflow.com/questions/61339259/how-to-dynamically-import-svg-and-render-it-inline
    import(`!!@svgr/webpack?-svgo,+titleProp,+ref!./svg/${icon}.svg`)
      .then(svg => setIcon(svg.default as unknown as ReactSVG))
      .catch(() => import(`./svg/${icon}.svg`)) // import "fallback" for test
      .catch(() => console.error('[svg] cannot find svg:', icon));
  }, [icon]);

  if (!SVGIcon) return <span className="svg-not-found" />;

  return <SVGIcon className={classNames('icon', className)} {...restProps} />;
}
