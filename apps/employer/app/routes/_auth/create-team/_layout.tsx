import { Outlet } from '@remix-run/react';

import { Card } from '@technifit/ui';

import { ProgressStepper } from '~/ui/progress-stepper';
import { useGetStepProgress } from './config';

export const CreateTeamLayout = () => {
  const { activeStep, totalSteps } = useGetStepProgress();

  return (
    <div className='flex w-full flex-col items-center gap-6 align-middle'>
      <Card className='w-full sm:w-1/2 md:max-w-xl lg:w-1/3'>
        <Outlet />
      </Card>
      {totalSteps > 1 ? <ProgressStepper activeStep={activeStep} totalSteps={totalSteps} /> : null}
    </div>
  );
};

export default CreateTeamLayout;
