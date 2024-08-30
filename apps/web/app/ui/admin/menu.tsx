'use client';

import { Link } from '@remix-run/react';

import { Button } from '@technifit/ui/button';
import { ScrollArea } from '@technifit/ui/scroll-area';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@technifit/ui/tooltip';
import { cn } from '@technifit/ui/utils';

import { useGetMenuList } from '~/lib/hooks/use-menu-list';
import { CollapseMenuButton } from './collapse-menu-button';

const Menu = () => {
  const { menuList } = useGetMenuList();

  return (
    <ScrollArea className='[&>div>div[style]]:!block'>
      <nav className='mt-8 h-dvh w-full'>
        <ul className='flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]'>
          {menuList.map(({ groupLabel, menus, hidden }, index) => (
            <>
              {!hidden ? (
                <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
                  {groupLabel ? (
                    <p className='max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground'>
                      {groupLabel}
                    </p>
                  ) : (
                    <p className='pb-2'></p>
                  )}
                  {menus.map(({ href, label, icon: Icon, active, submenus, hidden }, index) =>
                    submenus.length === 0 ? (
                      <>
                        {!hidden ? (
                          <div className='w-full' key={index}>
                            <TooltipProvider disableHoverableContent>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={active ? 'secondary' : 'ghost'}
                                    className='mb-1 h-10 w-full justify-start'
                                    asChild
                                  >
                                    <Link prefetch='intent' to={href}>
                                      <span className={cn('mr-4')}>
                                        <Icon size={18} />
                                      </span>
                                      <p className={cn('max-w-[200px] translate-x-0 truncate opacity-100')}>{label}</p>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className='w-full' key={index}>
                        <CollapseMenuButton icon={Icon} label={label} active={active} submenus={submenus} />
                      </div>
                    ),
                  )}
                </li>
              ) : null}
            </>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
};

export { Menu };
