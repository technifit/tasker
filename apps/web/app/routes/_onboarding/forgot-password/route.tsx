import { useState } from 'react';
import { useSignIn } from '@clerk/remix';
import { isClerkAPIResponseError } from '@clerk/remix/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { getSearchParams } from 'remix-params-helper';
import { $path } from 'remix-routes';
import { z } from 'zod';

import { Button } from '@technifit/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@technifit/ui/form';
import { Input } from '@technifit/ui/input';
import { Typography } from '@technifit/ui/typography';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';

const forgotPasswordFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
});

const forgotPasswordSearchParamsSchema = z.object({
  email: z.string().email().optional(),
});

export type ForgotPasswordSearchParams = z.infer<typeof forgotPasswordSearchParamsSchema>;

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

const resolver = zodResolver(forgotPasswordFormSchema);

export const loader = ({ request }: LoaderFunctionArgs) => {
  const { success, data } = getSearchParams(request, forgotPasswordSearchParamsSchema);

  return { email: success && data.email ? data.email : undefined };
};
export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Forgot Password' }, { name: 'description', content: 'Forgot Password' }];
};

export type SearchParams = ForgotPasswordSearchParams;

export const ForgotPassword = () => {
  const { email } = useLoaderData<typeof loader>();
  const { isLoaded, signIn } = useSignIn();
  const [error, setError] = useState<ErrorAlertProps | null>(null);

  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormData>({
    resolver,
    defaultValues: {
      email,
    },
    submitHandlers: {
      onValid: async ({ email }) => {
        if (isLoaded) {
          try {
            const signInResponse = await signIn.create({
              strategy: 'reset_password_email_code',
              identifier: email,
            });

            if (signInResponse.status === 'needs_first_factor') {
              setTimeout(() => {
                navigate($path('/reset-password'));
              }, 500);
            } else if (signInResponse.status === 'needs_new_password') {
              console.log('invalid password!');
            }
          } catch (error) {
            if (isClerkAPIResponseError(error)) {
              error.errors.forEach((error) => {
                setError({
                  heading: 'Something went wrong',
                  description: error.message,
                });
              });
            } else {
              setError({
                heading: 'Something went wrong',
                description: 'Please try again later.',
              });
            }
          }
        }
      },
    },
  });

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Forgot your password?
        </Typography>
        <Typography variant={'mutedText'}>We will have you up and running in no time</Typography>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input autoComplete='email' type='email' placeholder='joe.blogs@org.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null}
          <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Sending Password Reset Email...' : 'Get Password Reset Email'}
          </Button>
        </form>
      </Form>
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
