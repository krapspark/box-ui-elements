import * as React from 'react';
import { mountConnected } from 'test-utils/enzyme';

import Tooltip from 'box-ui-elements/es/components/tooltip';
import * as libDom from 'lib/dom';

import CollapsibleSidebarMenuItem from '../CollapsibleSidebarMenuItem';
import CollapsibleSidebarContext from '../CollapsibleSidebarContext';

jest.mock('lib/dom', () => ({ useIsContentOverflowed: jest.fn() }));

describe('components/core/collapsible-sidebar/__tests__/CollapsibleSidebarMenuItem', () => {
    const getWrapper = (props, { isScrolling = false } = {}) => {
        return mountConnected(
            <CollapsibleSidebarContext.Provider value={{ isScrolling }}>
                <CollapsibleSidebarMenuItem {...props} />
            </CollapsibleSidebarContext.Provider>,
        );
    };

    test('matches snapshot', () => {
        libDom.useIsContentOverflowed.mockReturnValue(false);

        const wrapper = getWrapper(
            {
                className: 'foo',
                text: 'bar',
                icon: 'bold',
            },
            { isScrolling: false },
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should allow tooltip if text is overflowing and not scrolling', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = getWrapper({ text: 'bar', icon: 'bold' }, { isScrolling: false });

        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemToolTip').length).toBe(1);
        expect(wrapper.find(Tooltip).prop('isShown')).toBe(undefined); // can show on hover
        expect(wrapper.find(Tooltip).prop('isDisabled')).toBe(false);
    });

    test('should not render visible tooltip if text is overflowing and scrolling', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = getWrapper({ text: 'bar', icon: 'bold' }, { isScrolling: true });

        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemToolTip').length).toBe(0);
    });

    test('should spread props to inner element', () => {
        const mouseEvent = jest.fn();

        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            onMouseOver: mouseEvent,
        });

        const classNameTarget = wrapper.find('div.bdl-CollapsibleSidebar-menuItem');
        const restTarget = classNameTarget;
        expect(restTarget.prop('onMouseOver')).toBe(mouseEvent);
        expect(classNameTarget.prop('className')).toContain(' foo');
    });
});