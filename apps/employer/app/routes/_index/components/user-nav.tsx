import { useClerk, useUser } from '@clerk/remix';
import { useNavigate } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Theme, useTheme } from 'remix-themes';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Skeleton,
} from '@technifit/ui';

export function UserNav() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();

  const handleSignOutClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    await signOut();
    navigate($path('/log-in'));
  };

  const handleChangeThemeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  if (!isLoaded || !user) {
    return <Skeleton className='relative h-8 w-8 rounded-full' />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={user.imageUrl} alt={user.fullName ?? 'User Image'} />
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
            <p className='truncate text-xs leading-none text-muted-foreground'>
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='inline-flex w-full justify-between gap-1' onClick={handleChangeThemeClick}>
          Switch Theme
          {theme ? <Badge className='px-1.5 py-0.5'>{theme}</Badge> : null}
          <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOutClick}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
