### Examples

**Open**
```js
const Sidebar = require('box-ui-elements/es/components/sidebar').Sidebar;
const SidebarLogo = require('box-ui-elements/es/components/sidebar').SidebarLogo;
const SidebarNav = require('box-ui-elements/es/components/sidebar').SidebarNav;
const SidebarFooter = require('box-ui-elements/es/components/sidebar').SidebarFooter;
const SidebarNavItem = require('box-ui-elements/es/components/sidebar').SidebarNavItem;

<Sidebar animation='overlay' expanded={true}>
    <SidebarLogo>
        Logo Item
    </SidebarLogo>

    <SidebarNav>
        <SidebarNavItem>
            <span>expanded 1</span>
            <span>collapsed 1</span>
        </SidebarNavItem>
        <SidebarNavItem>
            <span>expanded 2</span>
            <span>collapsed 2</span>
        </SidebarNavItem>
        <SidebarNavItem>
            <span>expanded 3</span>
            <span>collapsed 3</span>
        </SidebarNavItem>
    </SidebarNav>

    <SidebarFooter>
        Footer Items
    </SidebarFooter>
</Sidebar>
```

**Closed**
```js
const Sidebar = require('box-ui-elements/es/components/sidebar').Sidebar;
const SidebarLogo = require('box-ui-elements/es/components/sidebar').SidebarLogo;
const SidebarNav = require('box-ui-elements/es/components/sidebar').SidebarNav;
const SidebarFooter = require('box-ui-elements/es/components/sidebar').SidebarFooter;
const SidebarNavItem = require('box-ui-elements/es/components/sidebar').SidebarNavItem;

<Sidebar animation='overlay' expanded={false}>
    <SidebarLogo>
        Logo Item
    </SidebarLogo>

    <SidebarNav>
        <SidebarNavItem>
            <span>expanded 1</span>
            <span>collapsed 1</span>
        </SidebarNavItem>
        <SidebarNavItem>
            <span>expanded 2</span>
            <span>collapsed 2</span>
        </SidebarNavItem>
        <SidebarNavItem>
            <span>expanded 3</span>
            <span>collapsed 3</span>
        </SidebarNavItem>
    </SidebarNav>

    <SidebarFooter>
        Footer Items
    </SidebarFooter>
</Sidebar>
```
