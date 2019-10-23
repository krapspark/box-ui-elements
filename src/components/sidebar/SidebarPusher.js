// @flow
import React from 'react';
import cx from 'classnames';

type Props = {
    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: String,
};

function SidebarPusher(props: Props) {
    const { className, children } = props;

    const classes = cx('bdl-Sidebar-pusher', className);

    return <div className={classes}>{children}</div>;
}

export default SidebarPusher;
