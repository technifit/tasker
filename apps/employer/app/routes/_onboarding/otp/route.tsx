import { useSignUp } from '@clerk/remix';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { $path } from 'remix-routes';

import { Typography } from '@technifit/ui';

import { OtpForm } from './forms/otp-form';

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | One Time Password' }, { name: 'description', content: 'One Time Password' }];
};

export const Otp = () => {
  const { signUp } = useSignUp();

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Verify email
        </Typography>
        <Typography variant={'mutedText'}>
          Enter the code we have sent to <strong>{signUp?.emailAddress}</strong>
        </Typography>
      </div>
      <OtpForm />
      <div className='flex flex-col gap-2 text-center'>
        <Typography variant={'mutedText'}>
          Already have an account?{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to={$path('/log-in')}>
              Sign In
            </Link>
          </Typography>
          .
        </Typography>
      </div>
    </div>
  );
};

export default Otp;
