// @flow
import React, { Component, createRef } from 'react';
import invoke from 'lodash/invoke';
import classNames from 'classnames';

import './Sidebar.scss';

type Props = {
    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: String,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded?: Boolean,

    /** Handler to collapse sidebar */
    onCollapse?: Function,
};

const doesNodeContainClick = (node, e) => {
    if (node && e.target) {
        return node.contains(e.target) || node === e.target;
    }

    return false;
};

class Sidebar extends Component<Props> {
    static defaultProps = {
        expanded: false,
    };

    ref = createRef();

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick, true);
    }

    handleDocumentClick = e => {
        if (!doesNodeContainClick(this.ref.current, e)) {
            invoke(this.props, 'onCollapse', e, {
                ...this.props,
                expanded: false,
            });
        }
    };

    render() {
        const { children, className, expanded } = this.props;
        const { isForceExpanded } = this.state;

        const classes = classNames((expanded || isForceExpanded) && 'is-expanded', 'bdl-Sidebar', className);

        return (
            <div className="bdl-Sidebar-wrapper">
                <nav className={classes} ref={this.ref}>
                    {React.Children.map(children, child => {
                        return React.cloneElement(child, { expanded });
                    })}
                </nav>
            </div>
        );
    }
}

export default Sidebar;
