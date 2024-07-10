import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Theme, useTheme } from 'remix-themes';

import { Avatar, AvatarFallback, AvatarImage } from '@technifit/ui/avatar';
import { Button } from '@technifit/ui/button';
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
import { Typography } from '@technifit/ui/typography';

import { useOrganisation } from '~/routes/_auth/hooks/use-org';
import { useUser } from '~/routes/_auth/hooks/use-user';
import { useLogout } from '~/routes/resources/logout/route';

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

export function UserNav() {
  const user = useUser();
  const organisation = useOrganisation();
  const { logOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative size-8 rounded-full'>
          <Avatar className='size-9'>
            <AvatarImage src={user.profilePictureUrl ?? undefined} alt={user.fullName ?? 'User Image'} />
            <AvatarFallback>
              {user?.fullName
                ?.match(/(\b\S)?/g)
                ?.join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-2'>
            <Typography className='truncate font-medium leading-none'>{user?.fullName}</Typography>
            <Typography variant={'extraSmallText'} className='truncate text-muted-foreground'>
              {user.email}
            </Typography>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
              <Link
                className='inline-flex grow items-center gap-3'
                prefetch='intent'
                to={$path('/create-organisation')}
              >
                <Boxes className='size-4' />
                New Team
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
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
