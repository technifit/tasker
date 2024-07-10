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
  DropdownMenuTrigger,
} from '@technifit/ui/dropdown-menu';
import { Boxes, LogOut, Moon, Settings, Sun } from '@technifit/ui/icons';

import { useOrganisation } from '~/routes/_auth/hooks/use-org';
import { useUser } from '~/routes/_auth/hooks/use-user';
import { useLogout } from '~/routes/resources/logout/route';

export function UserNav() {
  const user = useUser();
  const organisation = useOrganisation();
  const { logOut } = useLogout();
  const [theme, setTheme] = useTheme();

  const handleChangeThemeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-9 w-9'>
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
          <div className='flex flex-col space-y-1'>
            <p className='truncate text-sm font-medium leading-none'>{user?.fullName}</p>
            <p className='truncate text-xs leading-none text-muted-foreground'>{user.email}</p>
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
        <DropdownMenuItem className='inline-flex w-full items-center gap-3' onClick={handleChangeThemeClick}>
          {theme === Theme.LIGHT ? <Sun className='size-4' /> : <Moon className='size-4' />}
          Switch Theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='inline-flex w-full items-center gap-3' onClick={logOut}>
          <LogOut className='size-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
