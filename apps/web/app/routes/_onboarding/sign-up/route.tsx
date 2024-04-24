import { useState } from 'react';
import { useSignUp } from '@clerk/remix';
import { isClerkAPIResponseError } from '@clerk/remix/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { $path } from 'remix-routes';
import { z } from 'zod';

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

const signUpFormSchema = z.object({
  firstName: z.string({ required_error: 'Please enter your first name' }).min(1),
  lastName: z.string({ required_error: 'Please enter your last name' }).min(1),
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
  password: z.string({ required_error: 'Please enter your password' }).min(8),
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

const resolver = zodResolver(signUpFormSchema);

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Sign Up' }, { name: 'description', content: 'Sign up' }];
};

export const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState<ErrorAlertProps | null>(null);
  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    resolver,
    submitHandlers: {
      onValid: async ({ email, firstName, lastName, password }) => {
        if (isLoaded) {
          try {
            const signInResponse = await signUp.create({
              firstName,
              lastName,
              password,
              emailAddress: email,
            });

            switch (signInResponse.status) {
              case 'complete':
                await setActive({ session: signInResponse.createdSessionId });

                navigate($path('/'));
                break;
              case 'missing_requirements':
                if (signInResponse.unverifiedFields.some((x) => x === 'email_address')) {
                  await signUp.prepareEmailAddressVerification({
                    strategy: 'email_code',
                  });
                  navigate($path('/otp'));
                }
                break;
              default:
                break;
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
            <div className='flex w-full flex-col gap-3 lg:flex-row'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input autoComplete='family-name' placeholder='Joe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input autoComplete='family-name' placeholder='Bloggs' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          </div>
          {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null}
          <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
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
