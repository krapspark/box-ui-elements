// @flow
import React from 'react';
import cx from 'classnames';

type Props = {
    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: String,
};

function SidebarFooter(props: Props) {
    const { className, children, ...rest } = props;

    const classes = cx('bdl-Sidebar-footer', className);

    return (
        <div {...rest} className={classes}>
            {children}
        </div>
    );
}

export default SidebarFooter;
