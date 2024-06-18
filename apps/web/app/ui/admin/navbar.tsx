import { Typography } from '@technifit/ui/typography';

import { UserNav } from '~/routes/_auth/components/user-nav';
import { SheetMenu } from './sheet-menu';

const Navbar = () => {
  return (
    <header className='sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary'>
      <div className='mx-4 flex h-14 items-center sm:mx-8'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <SheetMenu />
          <Typography variant={'h5'}>Tasker</Typography>
        </div>
        <div className='flex flex-1 items-center justify-end space-x-2'>
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export { Navbar };
