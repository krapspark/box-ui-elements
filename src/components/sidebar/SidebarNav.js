// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: String,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded: Boolean,
};

function SidebarNav(props: Props) {
    const { className, children, expanded, ...rest } = props;

    const classes = classNames('bdl-Sidebar-nav', className);

    return (
        <div {...rest} className={classes}>
            {React.Children.map(children, child => {
                return React.cloneElement(child, { expanded });
            })}
        </div>
    );
}

export default SidebarNav;
