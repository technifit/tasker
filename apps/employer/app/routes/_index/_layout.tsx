import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';
import { UserNav } from './components/user-nav';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker' }, { name: 'description', content: 'Large scale job processing done right' }];
};

export const Index = () => {
  return (
    <div className='container grid grid-cols-1 py-4 lg:grid-cols-1'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-end'>
          <UserNav />
        </div>
        <div className='flex grow flex-col items-center justify-center'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Index;
