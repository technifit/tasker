import { useOrganization } from '@clerk/remix';
import { useLocation } from '@remix-run/react';
import { $path } from 'remix-routes';

import { Boxes, LayoutGrid, LayoutList, ListTodo, Settings, Users } from '@technifit/ui/icons';
import type { LucideIcon } from '@technifit/ui/icons';

interface Submenu {
  href: string;
  label: string;
  active: boolean;
}

interface Menu {
  href: string;
  label: string;
  active: boolean;
  loading?: boolean;
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
  isLoading: boolean;
  menuList: Group[];
} => {
  const { pathname } = useLocation();
  const { isLoaded, organization, membership } = useOrganization();

  const isAdmin = membership?.role === 'admin';

  return {
    isLoading: !isLoaded,
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
            href: organization?.slug
              ? $path('/:organisationSlug/my-tasks', { organisationSlug: organization.slug })
              : '',
            label: 'My Tasks',
            hidden: !organization,
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
            href: organization?.slug
              ? $path('/:organisationSlug/members', { organisationSlug: organization.slug })
              : '',
            label: 'Members',
            active: pathname.includes('/users'),
            hidden: !organization,
            icon: Users,
            submenus: [],
          },
          {
            href: organization?.slug ? $path('/:organisationSlug/tasks', { organisationSlug: organization.slug }) : '',
            label: 'Tasks',
            active: pathname.includes('/tasks'),
            hidden: !organization,
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
            hidden: !organization || !isAdmin,
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
