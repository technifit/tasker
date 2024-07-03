import { useLocation } from '@remix-run/react';
import { $path } from 'remix-routes';

import { Boxes, LayoutGrid, LayoutList, ListTodo, Settings, Users } from '@technifit/ui/icons';
import type { LucideIcon } from '@technifit/ui/icons';

import { useOrganisation } from '~/routes/_auth/hooks/use-org';
import { useRole } from '~/routes/_auth/hooks/use-role';

interface Submenu {
  href: string;
  label: string;
  active: boolean;
}

interface Menu {
  href: string;
  label: string;
  active: boolean;
  hidden?: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
}

interface Group {
  groupLabel: string;
  hidden?: boolean;
  menus: Menu[];
}

const useGetMenuList = (): {
  menuList: Group[];
} => {
  const { pathname } = useLocation();
  const organisation = useOrganisation();
  const admin = useRole();

  const isAdmin = admin === 'admin';

  return {
    menuList: [
      {
        groupLabel: '',
        menus: [
          {
            href: $path('/'),
            label: 'Dashboard',
            active: pathname.includes('/dashboard'),
            icon: LayoutGrid,
            submenus: [],
          },
        ],
      },
      {
        groupLabel: 'Personal',
        menus: [
          {
            href: organisation ? $path('/:organisationSlug/my-tasks', { organisationSlug: organisation.id }) : '',
            label: 'My Tasks',
            hidden: !organisation,
            active: pathname.includes('/my-tasks'),
            icon: ListTodo,
            submenus: [],
          },
        ],
      },
      // {
      //   groupLabel: 'Contents',
      //   menus: [
      //     {
      //       href: '',
      //       label: 'Posts',
      //       active: pathname.includes('/posts'),
      //       icon: SquarePen,
      //       submenus: [
      //         {
      //           href: '/posts',
      //           label: 'All Posts',
      //           active: pathname === '/posts',
      //         },
      //         {
      //           href: '/posts/new',
      //           label: 'New Post',
      //           active: pathname === '/posts/new',
      //         },
      //       ],
      //     },
      //     {
      //       href: '/categories',
      //       label: 'Categories',
      //       active: pathname.includes('/categories'),
      //       icon: Bookmark,
      //       submenus: [],
      //     },
      //     {
      //       href: '/tags',
      //       label: 'Tags',
      //       active: pathname.includes('/tags'),
      //       icon: Tag,
      //       submenus: [],
      //     },
      //   ],
      // },
      {
        groupLabel: 'Admin',
        hidden: !isAdmin,

        menus: [
          {
            href: organisation ? $path('/:organisationSlug/members', { organisationSlug: organisation.id }) : '',
            label: 'Members',
            active: pathname.includes('/users'),
            hidden: !organisation,
            icon: Users,
            submenus: [],
          },
          {
            href: organisation ? $path('/:organisationSlug/tasks', { organisationSlug: organisation.id }) : '',
            label: 'Tasks',
            active: pathname.includes('/tasks'),
            hidden: !organisation,
            icon: LayoutList,
            submenus: [],
          },
        ],
      },
      {
        groupLabel: 'Settings',
        menus: [
          {
            href: $path('/settings/organisation'),
            label: 'Organisation Settings',
            active: pathname.includes('/settings/organisation'),
            hidden: !organisation || !isAdmin,
            icon: Boxes,
            submenus: [],
          },
          {
            href: $path('/settings/account/preferences'),
            label: 'Preferences',
            active: pathname.includes('/settings/account/preferences'),
            icon: Settings,
            submenus: [],
          },
        ],
      },
    ],
  };
};

export { useGetMenuList };
