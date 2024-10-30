import { useLocation } from '@remix-run/react';
import { $path } from 'remix-routes';

import { Boxes, LayoutGrid, LayoutList, ListTodo, Settings, Users } from '@technifit/ui/icons';
import type { LucideIcon } from '@technifit/ui/icons';

import { useOrganisation } from '~/routes/_auth/hooks/use-org';
import { useRole } from '~/routes/_auth/hooks/use-role';

interface Menu {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
}

interface Group {
  groupLabel: string;
  menus: Menu[];
}

const useGetMenuList = (): {
  menuList: Group[];
} => {
  const { pathname } = useLocation();
  const organisation = useOrganisation();
  const admin = useRole();

  const is_admin = admin === 'admin';

  const personal_group = {
    groupLabel: 'Personal',
    menus: [
      {
        href: organisation ? $path('/:organisationSlug/my-tasks', { organisationSlug: organisation.id }) : '',
        label: 'My Tasks',
        hidden: !organisation,
        active: pathname.includes('/my-tasks'),
        icon: ListTodo,
      },
    ],
  };

  const admin_group = {
    groupLabel: 'Admin',
    menus: [
      {
        href: organisation ? $path('/:organisationSlug/members', { organisationSlug: organisation.id }) : '',
        label: 'Members',
        active: pathname.includes('/members'),
        hidden: !organisation,
        icon: Users,
      },
      {
        href: organisation ? $path('/:organisationSlug/tasks', { organisationSlug: organisation.id }) : '',
        label: 'Tasks',
        active: pathname.includes('/tasks'),
        hidden: !organisation,
        icon: LayoutList,
      },
    ],
  };

  const settings_group = {
    groupLabel: 'Settings',
    menus: [
      ...(is_admin
        ? [
            {
              href: $path('/settings/organisation'),
              label: 'Organisation Settings',
              active: pathname.includes('/settings/organisation'),
              icon: Boxes,
            },
          ]
        : []),
      {
        href: $path('/settings/account/preferences'),
        label: 'Preferences',
        active: pathname.includes('/settings/account/preferences'),
        icon: Settings,
      },
    ],
  };

  return {
    menuList: [personal_group, ...(is_admin ? [admin_group] : []), settings_group],
  };
};

export { useGetMenuList };
