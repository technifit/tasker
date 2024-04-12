import { useState } from 'react';
import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  toast,
  Typography,
  useForm,
} from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';

const resetPasswordSchema = z.object({
  code: z
    .string({ required_error: 'Please enter your password reset code' })
    .min(6, { message: 'Code should be 6 characters' })
    .max(6, { message: 'Code should be 6 characters' }),
  password: z
    .string({ required_error: 'Please enter your new password' })
    .min(6, { message: 'Password should be a minimum of 6 characters' })
    .max(9, { message: 'Password should be a maximum of 9 characters' }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const resolver = zodResolver(resetPasswordSchema);

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Log In' }, { name: 'description', content: 'Log in' }];
};

export const ResetPassword = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<ErrorAlertProps | null>(null);
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormData>({
    resolver,
    submitHandlers: {
      onValid: async ({ code, password }) => {
        if (isLoaded) {
          try {
            const signInResponse = await signIn.attemptFirstFactor({
              strategy: 'reset_password_email_code',
              code,
              password,
            });

            if (signInResponse.status === 'complete') {
              await setActive({ session: signInResponse.createdSessionId });

              toast('Password Updated', {
                description: 'You will be redirected to the dashboard',
              });

              setTimeout(() => {
                navigate($path('/'));
              }, 1500);
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
          Reset Password
        </Typography>
        <Typography variant={'mutedText'}>Enter the code from your email and your new password</Typography>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      autoComplete='one-time-code'
                      type='numeric'
                      maxLength={6}
                      render={({ slots }) => (
                        <>
                          <InputOTPGroup>
                            {slots.slice(0, 3).map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}{' '}
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            {slots.slice(3).map((slot, index) => (
                              <InputOTPSlot key={index + 3} {...slot} />
                            ))}
                          </InputOTPGroup>
                        </>
                      )}
                      {...field}
                    />
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
                  <FormLabel>New Password</FormLabel>
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
            {form.formState.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
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
