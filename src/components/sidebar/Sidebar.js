// @flow
import React, { Component, createRef } from 'react';
import invoke from 'lodash/invoke';
import omit from 'lodash/omit';
import cx from 'classnames';

import SidebarPusher from './SidebarPusher';
import SidebarPushable from './SidebarPushable';
import SidebarLogo from './SidebarLogo';
import SidebarFooter from './SidebarFooter';
import SidebarNav from './SidebarNav';

import './Sidebar.scss';

type Props = {
    /** Animation style */
    animation: 'overlay' | 'push',

    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: String,

    /** An element type to render as (string or function). */
    component: React.elementType,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded?: Boolean,

    /** Called before sidebar begins to animate out */
    onCollapse?: Function,

    /** Called after sidebar has finished animating out */
    onCollapsed?: Function,

    /** Called when sidebar has finished animating in */
    onExpand?: Function,

    /** Called when sidebar begins animating in */
    onExpanded?: Function,

    /** A sidebar can handle clicks on the passed element. */
    target: any,
};

const doesNodeContainClick = (node, e) => {
    if (node && e.target) {
        return node.contains(e.target) || node === e.target;
    }

    return false;
};

class Sidebar extends Component<Props> {
    static defaultProps = {
        target: document,
        expanded: false,
    };

    static animationDuration = 500;

    static Pushable = SidebarPushable;

    static Pusher = SidebarPusher;

    static Logo = SidebarLogo;

    static Footer = SidebarFooter;

    static Nav = SidebarNav;

    ref = createRef();

    constructor(props) {
        super(props);

        this.state = {
            animationTick: 0,
            expanded: props.expanded,
        };
    }

    static getDerivedStateFromProps(props, state) {
        // We use `animationTick` to understand when an animation should be scheduled
        const tickIncrement = !!props.expanded === !!state.expanded ? 0 : 1;

        return {
            animationTick: state.animationTick + tickIncrement,
            expanded: props.expanded,
        };
    }

    componentDidMount() {
        const { target } = this.props;
        // TODO: Can this be abstracted out of component mount? Maybe a reusable component
        target.addEventListener('click', this.handleDocumentClick, true);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.animationTick > prevState.animationTick) {
            this.handleAnimationStart();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.animationTimer);
    }

    handleAnimationStart = () => {
        const { expanded } = this.props;
        const callback = expanded ? 'onExpand' : 'onCollapse';

        clearTimeout(this.animationTimer);
        this.animationTimer = setTimeout(this.handleAnimationEnd, Sidebar.animationDuration);

        if (this.skipNextCallback) {
            this.skipNextCallback = false;
            return;
        }

        invoke(this.props, callback, null, this.props);
    };

    handleAnimationEnd = () => {
        const { expanded } = this.props;
        const callback = expanded ? 'onExpanded' : 'onCollapsed';

        this.setState({ animationTick: 0 });
        invoke(this.props, callback, null, this.props);
    };

    handleDocumentClick = e => {
        if (!doesNodeContainClick(this.ref.current, e)) {
            this.skipNextCallback = true;
            invoke(this.props, 'onCollapse', e, {
                ...this.props,
                expanded: false,
            });
        }
    };

    render() {
        const { animation, children, className, component, expanded } = this.props;
        const { animationTick } = this.state;

        const classes = cx(
            animation && `bdl-${animation}`,
            animationTick > 0 && 'is-animating',
            expanded && 'is-expanded',
            'bdl-Sidebar',
            className,
        );

        const ElementType = component || 'div';
        const rest = omit(this.props, ['component', 'target']);

        return (
            <div className="bdl-Sidebar-wrapper">
                <ElementType {...rest} className={classes} ref={this.ref}>
                    {children}
                </ElementType>
            </div>
        );
    }
}

export default Sidebar;
