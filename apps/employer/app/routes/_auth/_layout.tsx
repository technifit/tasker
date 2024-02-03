import { Link, Outlet } from '@remix-run/react';
import { $path } from 'remix-routes';

import { Typography } from '@technifit/ui';

// export const config = { runtime: 'edge' };

export { loader } from './_layout.server';

const Layout = () => {
  return (
    <div className='container grid grid-cols-1 py-4 lg:grid-cols-2'>
      <div className='hidden lg:flex lg:flex-col lg:justify-between lg:gap-2'>
        <div className='flex justify-start'>
          <Link prefetch='intent' to={$path('/')} className='inline-flex items-center gap-1'>
            Tasker
          </Link>
        </div>
        <Typography variant={'blockquote'} className='mb-4'>
          <Typography className='text-lg'>
            &ldquo;This system has saved me countless hours of work and helped me complete jobs for my clients faster
            than ever before.&rdquo;
          </Typography>
          <footer className='text-sm'>Joe Bloggs</footer>
        </Typography>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex grow flex-col items-center justify-center'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
