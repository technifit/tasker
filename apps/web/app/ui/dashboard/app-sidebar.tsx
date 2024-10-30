import { Link } from '@remix-run/react';

import { Users } from '@technifit/ui/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@technifit/ui/sidebar';

import { useGetMenuList } from '~/lib/hooks/use-menu-list';
import { UserNav } from '../admin/user-nav';

const AppSidebar = () => {
  const { menuList } = useGetMenuList();

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        {menuList.map((group) => (
          <SidebarGroup key={group.groupLabel}>
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.menus.map((menu) => (
                  <SidebarMenuItem key={menu.label}>
                    <SidebarMenuButton isActive={menu.active} asChild>
                      <Link prefetch='intent' to={menu.href}>
                        <menu.icon />
                        <span>{menu.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
