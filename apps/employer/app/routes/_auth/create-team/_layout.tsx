import { Outlet } from '@remix-run/react';

import { Card } from '@technifit/ui';

export const CreateTeamLayout = () => {
  return (
    <Card className='w-full sm:w-1/2 md:max-w-xl lg:w-1/3'>
      <Outlet />
    </Card>
  );
};

export default CreateTeamLayout;
