import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Theme, useTheme } from 'remix-themes';

import { Avatar, AvatarFallback, AvatarImage } from '@technifit/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@technifit/ui/dropdown-menu';
import { Boxes, LaptopMinimal, LogOut, Moon, Settings, Sun } from '@technifit/ui/icons';
import { SidebarMenuButton } from '@technifit/ui/sidebar';
import { Typography } from '@technifit/ui/typography';

import { useOrganisation } from '~/routes/_auth/hooks/use-org';
import { useUser } from '~/routes/_auth/hooks/use-user';
import { useLogout } from '~/routes/resources/logout/route';

const UserInfo = () => {
  const { fullName, profilePictureUrl, email } = useUser();

  return (
    <div className='flex items-center gap-2'>
      <Avatar className='size-8'>
        <AvatarImage src={profilePictureUrl ?? undefined} alt={fullName} />
        <AvatarFallback>
          {fullName
            ?.match(/(\b\S)?/g)
            ?.join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='grid flex-1 gap-1'>
        <Typography className='truncate font-medium leading-none'>{fullName}</Typography>
        <Typography variant={'extraSmallText'} className='truncate text-muted-foreground'>
          {email}
        </Typography>
      </div>
    </div>
  );
};

function ThemeSelectionDropdown() {
  const [_, setTheme] = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='inline-flex w-full items-center gap-3'>
        <Sun className='size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
        <Moon className='absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        Switch Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem className='inline-flex w-full items-center gap-3' onClick={() => setTheme(Theme.LIGHT)}>
          <Sun className='size-4' /> Light
        </DropdownMenuItem>
        <DropdownMenuItem className='inline-flex w-full items-center gap-3' onClick={() => setTheme(Theme.DARK)}>
          <Moon className='size-4' />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className='inline-flex w-full items-center gap-3' onClick={() => setTheme(null)}>
          <LaptopMinimal className='size-4' />
          System
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

const UserActionsDropdown = () => {
  const organisation = useOrganisation();

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <Link
          className='inline-flex grow items-center gap-3'
          prefetch='intent'
          to={$path('/settings/account/preferences')}
        >
          <Settings className='size-4' />
          Settings
        </Link>
      </DropdownMenuItem>
      {organisation ? null : (
        <DropdownMenuItem>
          <Link className='inline-flex grow items-center gap-3' prefetch='intent' to={$path('/create-organisation')}>
            <Boxes className='size-4' />
            New Team
          </Link>
        </DropdownMenuItem>
      )}
    </DropdownMenuGroup>
  );
};

export function UserNav() {
  const { logOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <UserInfo />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right'>
        <DropdownMenuLabel className='font-normal'>
          <UserInfo />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserActionsDropdown />
        <DropdownMenuSeparator />
        <ThemeSelectionDropdown />
        <DropdownMenuSeparator />
        <DropdownMenuItem className='inline-flex w-full items-center gap-3' onClick={logOut}>
          <LogOut className='size-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
