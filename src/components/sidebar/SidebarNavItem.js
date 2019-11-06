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

function SidebarNavItem(props: Props) {
    const { className, children, expanded } = props;

    const elements = React.Children.toArray(children);
    if (elements.length !== 2) {
        throw new Error('Sidebar Nav Item must have exactly two children: Expanded element and collapsed element');
    }

    const classes = classNames('bdl-Sidebar-nav-item', className);

    const content = expanded ? elements[0] : elements[1];

    return <div className={classes}>{content}</div>;
}

export default SidebarNavItem;
