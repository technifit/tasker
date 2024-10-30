import { Outlet } from '@remix-run/react';

import { Card } from '@technifit/ui/card';

import { ProgressStepper } from '~/ui/progress-stepper';
import { useGetStepProgress } from './config';

export const CreateTeamLayout = () => {
  const { activeStep, totalSteps } = useGetStepProgress();

  return (
    <>
      <main className='container flex grow items-center py-4'>
        <div className='flex grow flex-col items-center gap-6 align-middle'>
          <Card className='w-full sm:w-1/2 md:max-w-xl lg:w-1/3'>
            <Outlet />
          </Card>
          {totalSteps > 1 ? <ProgressStepper activeStep={activeStep} totalSteps={totalSteps} /> : null}
        </div>
      </main>
    </>
  );
};

export default CreateTeamLayout;
