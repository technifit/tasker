import * as React from 'react';

import { cn } from '../..';

const ScreenSizeIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-primary/95 p-3 font-mono text-xs text-primary-foreground/95',
        className,
      )}
      {...props}
    >
      <div className='block sm:hidden'>xs</div>
      <div className='hidden sm:block md:hidden'>sm</div>
      <div className='hidden md:block lg:hidden'>md</div>
      <div className='hidden lg:block xl:hidden'>lg</div>
      <div className='hidden xl:block 2xl:hidden'>xl</div>
      <div className='hidden 2xl:block'>2xl</div>
    </div>
  ),
);
ScreenSizeIndicator.displayName = 'ScreenSizeIndicator';

export { ScreenSizeIndicator };
