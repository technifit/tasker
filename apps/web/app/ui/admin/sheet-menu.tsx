import { Link } from '@remix-run/react';

import { Button } from '@technifit/ui/button';
import { MenuIcon, PanelsTopLeft } from '@technifit/ui/icons';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@technifit/ui/sheet';
import { Typography } from '@technifit/ui/typography';

import { Menu } from './menu';

const SheetMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-8' variant='outline' size='icon'>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex h-full flex-col px-3 sm:w-72' side='left'>
        <SheetHeader>
          <Button className='flex items-center justify-center pb-2 pt-1' variant='link' asChild>
            <Link to='/' prefetch='intent' className='flex items-center gap-2'>
              <PanelsTopLeft className='mr-1 h-6 w-6' />
              <Typography variant={'h5'}>Tasker</Typography>
            </Link>
          </Button>
        </SheetHeader>
        <Menu />
      </SheetContent>
    </Sheet>
  );
};

export { SheetMenu };
