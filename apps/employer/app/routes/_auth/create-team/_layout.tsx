import { Outlet } from '@remix-run/react';

import { Card, Progress } from '@technifit/ui';

import { useGetStepProgress } from './config';

export const CreateTeamLayout = () => {
  const { activeStep, totalSteps } = useGetStepProgress();

  return (
    <div className='flex w-full flex-col items-center gap-6 align-middle'>
      <Card className='w-full sm:w-1/2 md:max-w-xl lg:w-1/3'>
        <Outlet />
      </Card>
      {totalSteps > 1 ? (
        <div className='flex w-full justify-between gap-2 sm:w-1/6 md:max-w-lg lg:w-1/4'>
          {Array.from({ length: totalSteps }, (_item, index) => (
            <Progress size={'sm'} key={index} value={index <= activeStep - 1 ? 100 : 0} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CreateTeamLayout;
