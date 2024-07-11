'use client';

import { useState } from 'react';
import { Link } from '@remix-run/react';

import { Button } from '@technifit/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@technifit/ui/collapsible';
import { ChevronDown, Dot } from '@technifit/ui/icons';
import type { LucideIcon } from '@technifit/ui/icons';
import { cn } from '@technifit/ui/utils';

interface Submenu {
  href: string;
  label: string;
  active: boolean;
}

interface CollapseMenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
}

export function CollapseMenuButton({ icon: Icon, label, active, submenus }: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className='w-full'>
      <CollapsibleTrigger className='mb-1 [&[data-state=open]>div>div>svg]:rotate-180' asChild>
        <Button variant={active ? 'secondary' : 'ghost'} className='h-10 w-full justify-start'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center'>
              <span className='mr-4'>
                <Icon size={18} />
              </span>
              <p className={cn('max-w-[150px] translate-x-0 truncate opacity-100')}>{label}</p>
            </div>
            <div className={cn('-translate-x-96 whitespace-nowrap opacity-0')}>
              <ChevronDown size={18} className='transition-transform duration-200' />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden'>
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={active ? 'secondary' : 'ghost'}
            className='mb-1 h-10 w-full justify-start'
            asChild
          >
            <Link to={href}>
              <span className='ml-2 mr-4'>
                <Dot size={18} />
              </span>
              <p className={cn('ranslate-x-0 max-w-[170px] truncate opacity-100')}>{label}</p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
