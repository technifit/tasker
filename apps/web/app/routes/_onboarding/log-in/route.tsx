import { useState } from 'react';
import { useSignIn } from '@clerk/remix';
import { isClerkAPIResponseError } from '@clerk/remix/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MetaFunction } from '@remix-run/node';
import { Link, useNavigate } from '@remix-run/react';
import { $path } from 'remix-routes';
import { z } from 'zod';

import { Button } from '@technifit/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@technifit/ui/form';
import { Input } from '@technifit/ui/input';
import { Typography } from '@technifit/ui/typography';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';

const logInFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
  password: z.string({ required_error: 'Please enter your password' }).min(8),
});

type LogInFormData = z.infer<typeof logInFormSchema>;

const resolver = zodResolver(logInFormSchema);

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Log In' }, { name: 'description', content: 'Log in' }];
};

export const SignUp = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<ErrorAlertProps | null>(null);
  const navigate = useNavigate();

  const form = useForm<LogInFormData>({
    resolver,
    submitHandlers: {
      onValid: async ({ email, password }) => {
        if (isLoaded) {
          try {
            const signInResponse = await signIn.create({
              identifier: email,
              password,
            });

            switch (signInResponse.status) {
              case 'complete':
                await setActive({ session: signInResponse.createdSessionId });
                setTimeout(() => {
                  navigate($path('/'));
                }, 500);
                break;
              case 'needs_new_password':
                setError({
                  heading: 'Password Reset Required',
                  description: 'Your password has expired. Please reset your password to continue.',
                });
                break;
              case 'needs_first_factor':
                setError({
                  heading: 'First Factor Authentication Required',
                  description:
                    'First factor verification for the provided identifier needs to be prepared and verified.',
                });
                break;
              case 'needs_second_factor':
                setError({
                  heading: 'Second Factor Authentication Required',
                  description:
                    'Second factor verification (2FA) for the provided identifier needs to be prepared and verified.',
                });
                break;
              case 'needs_identifier':
                setError({
                  heading: 'Invalid configuration',
                  description: `The authentication identifier hasn't been provided.`,
                });
                break;
              default:
                setError({
                  heading: 'Unknown Error',
                  description: 'An unknown error occurred. Please try again.',
                });
                break;
            }
          } catch (error) {
            if (isClerkAPIResponseError(error)) {
              error.errors.forEach((error) => {
                setError({
                  heading: 'Invalid email or password',
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

  const { email } = form.watch();

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
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
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input autoComplete='password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Typography asChild variant={'link'} className='text-sm'>
                <Link prefetch='intent' to={$path('/forgot-password', email ? { email } : undefined)}>
                  Forgot Password?
                </Link>
              </Typography>
            </div>
          </div>
          {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null}
          <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
