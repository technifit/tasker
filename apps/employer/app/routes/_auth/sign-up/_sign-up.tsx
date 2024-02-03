import { Link } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { $path } from 'remix-routes';

import { Typography } from '@technifit/ui';

import { SignUpForm } from './forms/sign-up-form';

// export const config = { runtime: 'edge' };

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Sign Up' }, { name: 'description', content: 'Sign up' }];
};

export const Signup = () => {
  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-4'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Create an account
        </Typography>
        <Typography variant={'mutedText'}>
          {' '}
          Already have an account?{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to={$path('/log-in')}>
              Sign In
            </Link>
          </Typography>
          .
        </Typography>
      </div>
      <SignUpForm />
      <div className='flex flex-col gap-2 text-center'>
        <Typography variant={'mutedText'}>
          By clicking continue, you agree to our{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to='/terms'>
              Terms of Service
            </Link>
          </Typography>{' '}
          and{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to='/privacy'>
              Privacy Policy
            </Link>
          </Typography>
          .
        </Typography>
      </div>
    </div>
  );
};

export default Signup;
