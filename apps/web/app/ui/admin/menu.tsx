'use client';

import { Link } from '@remix-run/react';

import { Button } from '@technifit/ui/button';
import { Ellipsis } from '@technifit/ui/icons';
import { ScrollArea } from '@technifit/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@technifit/ui/tooltip';
import { cn } from '@technifit/ui/utils';

import { useGetMenuList } from '~/lib/hooks/use-menu-list';
import { CollapseMenuButton } from './collapse-menu-button';

interface MenuProps {
  isOpen: boolean | undefined;
}

const Menu = ({ isOpen }: MenuProps) => {
  const { menuList } = useGetMenuList();

  return (
    <ScrollArea className='[&>div>div[style]]:!block'>
      <nav className='mt-8 h-dvh w-full'>
        <ul className='flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]'>
          {menuList.map(({ groupLabel, menus, hidden }, index) => (
            <>
              {!hidden ? (
                <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
                  {(isOpen && groupLabel) ?? isOpen === undefined ? (
                    <p className='max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground'>
                      {groupLabel}
                    </p>
                  ) : !isOpen && isOpen !== undefined && groupLabel ? (
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger className='w-full'>
                          <div className='flex w-full items-center justify-center'>
                            <Ellipsis className='h-5 w-5' />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side='right'>
                          <p>{groupLabel}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                                      <span className={cn(isOpen === false ? '' : 'mr-4')}>
                                        <Icon size={18} />
                                      </span>
                                      <p
                                        className={cn(
                                          'max-w-[200px] truncate',
                                          isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100',
                                        )}
                                      >
                                        {label}
                                      </p>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                {isOpen === false && <TooltipContent side='right'>{label}</TooltipContent>}
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className='w-full' key={index}>
                        <CollapseMenuButton
                          icon={Icon}
                          label={label}
                          active={active}
                          submenus={submenus}
                          isOpen={isOpen}
                        />
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
