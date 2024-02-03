import { Link } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { $path } from 'remix-routes';

import { Typography } from '@technifit/ui';

import { LoginForm } from './forms/log-in-form';

export const config = { runtime: 'edge' };

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Log In' }, { name: 'description', content: 'Log in' }];
};

export const SignUp = () => {
  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-4'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Sign in
        </Typography>
        <Typography variant={'mutedText'}>
          New to Tasker?{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to={$path('/sign-up')}>
              Sign up for an account
            </Link>
          </Typography>
          .
        </Typography>
      </div>
      <LoginForm />
    </div>
  );
};

export default SignUp;
