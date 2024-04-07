'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../..';

const progressVariants = cva('relative w-full overflow-hidden rounded-full bg-secondary', {
  variants: {
    size: {
      default: 'h-2',
      sm: 'h-1',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  active?: boolean;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, size, active, ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn(progressVariants({ size, className }))} {...props} {...props}>
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 bg-primary transition-all', {
          'animate-pulse': active,
        })}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
