import { Button } from '@technifit/ui/button';
import { ChevronLeft } from '@technifit/ui/icons';
import { cn } from '@technifit/ui/utils';

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

const SidebarToggle = ({ isOpen, setIsOpen }: SidebarToggleProps) => {
  return (
    <div className='invisible absolute -right-[16px] top-[12px] z-20 bg-white dark:bg-primary-foreground lg:visible'>
      <Button onClick={() => setIsOpen?.()} className='h-8 w-8 rounded-md' variant='outline' size='icon'>
        <ChevronLeft
          className={cn(
            'h-4 w-4 transition-transform duration-700 ease-in-out',
            isOpen === false ? 'rotate-180' : 'rotate-0',
          )}
        />
      </Button>
    </div>
  );
};

export { SidebarToggle };
