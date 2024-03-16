import { Link } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { getSearchParams } from 'remix-params-helper';
import { $path } from 'remix-routes';

import { Typography } from '@technifit/ui';

import { ForgotPasswordForm } from './forms/forgot-password-form';
import { forgotPasswordSearchParamsSchema } from './schema/forgot-password-form-schema';
import type { ForgotPasswordSearchParams } from './schema/forgot-password-form-schema';

export const loader = ({ request }: LoaderFunctionArgs) => {
  const { success, data } = getSearchParams(request, forgotPasswordSearchParamsSchema);

  return { email: success && data.email ? data.email : undefined };
};
export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Forgot Password' }, { name: 'description', content: 'Forgot Password' }];
};

export type SearchParams = ForgotPasswordSearchParams;

export const ForgotPassword = () => {
  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Forgot your password?
        </Typography>
        <Typography variant={'mutedText'}>We will have you up and running in no time</Typography>
      </div>
      <ForgotPasswordForm />
      <Typography variant={'mutedText'} className='text-center'>
        Dont have an account?{' '}
        <Typography asChild variant={'link'}>
          <Link prefetch='intent' to={$path('/sign-up')}>
            Sign Up
          </Link>
        </Typography>
        .
      </Typography>
    </div>
  );
};

export default ForgotPassword;
