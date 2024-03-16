import { Link } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { $path } from 'remix-routes';

import { Typography } from '@technifit/ui';

import { ResetPasswordForm } from './forms/reset-password-form';

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Log In' }, { name: 'description', content: 'Log in' }];
};

export const ResetPassword = () => {
  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Reset Password
        </Typography>
        <Typography variant={'mutedText'}>Enter the code from your email and your new password</Typography>
      </div>
      <ResetPasswordForm />
      <Typography variant={'mutedText'} className='text-center'>
        Dont have an account?{' '}
        <Typography asChild variant={'link'}>
          <Link prefetch='intent' to={$path('/sign-up')}>
            Reset Password
          </Link>
        </Typography>
        .
      </Typography>
    </div>
  );
};

export default ResetPassword;
