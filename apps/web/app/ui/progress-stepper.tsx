import { Progress } from '@technifit/ui/progress';

export const ProgressStepper = ({ activeStep, totalSteps }: { totalSteps: number; activeStep: number }) => {
  return (
    <div className='flex w-full justify-between gap-2 sm:w-1/6 md:max-w-lg lg:w-1/4'>
      {Array.from({ length: totalSteps }, (_item, index) => (
        <Progress size={'sm'} key={index} active={index === activeStep - 1} value={index <= activeStep - 1 ? 100 : 0} />
      ))}
    </div>
  );
};
