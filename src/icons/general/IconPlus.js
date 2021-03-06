// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconPlus = ({ className = '', color = '#000000', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG className={`icon-plus ${className}`} height={height} title={title} viewBox="0 0 16 16" width={width}>
        <path d="M5 5H2v2h3v3h2V7h3V5H7V2H5v3z" fill={color} fillRule="evenodd" />
    </AccessibleSVG>
);

export default IconPlus;
