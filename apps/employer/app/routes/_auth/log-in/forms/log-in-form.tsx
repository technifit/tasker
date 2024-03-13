import { useState } from 'react';
import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { Link, useNavigate } from '@remix-run/react';
import { $path } from 'remix-routes';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Typography,
  useForm,
} from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';
import type { LogInFormData } from '../schema/log-in-form-schema';
import { logInFormResolver as resolver } from '../schema/log-in-form-schema';

export const LoginForm = () => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit} className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col gap-2'>
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
              <Link prefetch='intent' to={$path('/forgot-password')}>
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
  );
};
