import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';

import { Button } from '@technifit/ui/button';
import { PanelsTopLeft } from '@technifit/ui/icons';
import { Typography } from '@technifit/ui/typography';
import { cn } from '@technifit/ui/utils';

import { Menu } from './menu';

const Sidebar = () => {
  //const sidebar = useStore(useSidebarToggle, (state) => state);

  //if(!sidebar) return null;

  // TODO: Implement sidebar state
  const sidebar = {
    isOpen: true,
    setIsOpen: () => {
      console.log('setIsOpen');
    },
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 grow -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72',
      )}
    >
      {/* <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} /> */}
      <div className='relative flex flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800'>
        <Button
          className={cn(
            'mb-1 transition-transform duration-300 ease-in-out',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0',
          )}
          variant='link'
          asChild
        >
          <Link to={$path('/')} className='flex items-center gap-2'>
            <PanelsTopLeft className='mr-1 h-6 w-6' />
            <Typography
              variant={'h4'}
              className={cn(
                'whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-in-out',
                sidebar?.isOpen === false ? 'hidden -translate-x-96 opacity-0' : 'translate-x-0 opacity-100',
              )}
            >
              Tasker
            </Typography>
          </Link>
        </Button>
        <Menu isOpen={sidebar.isOpen} />
      </div>
    </aside>
  );
};

export { Sidebar };
