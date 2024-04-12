import { useState } from 'react';
import { isClerkAPIResponseError, useSignUp } from '@clerk/remix';
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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Typography,
  useForm,
} from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';

const otpFormSchema = z.object({
  otp: z
    .string({ required_error: 'Please enter your one time password' })
    .min(6, { message: 'Code shold be 6 characters' })
    .max(6, { message: 'Code shold be 6 characters' }),
});

type OtpFormData = z.infer<typeof otpFormSchema>;

const resolver = zodResolver(otpFormSchema);

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | One Time Password' }, { name: 'description', content: 'One Time Password' }];
};

export const Otp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState<ErrorAlertProps | null>(null);
  const navigate = useNavigate();

  const form = useForm<OtpFormData>({
    resolver,
    submitHandlers: {
      onValid: async ({ otp }) => {
        if (isLoaded) {
          try {
            const signInResponse = await signUp.attemptEmailAddressVerification({
              code: otp,
            });

            switch (signInResponse.status) {
              case 'complete':
                await setActive({ session: signInResponse.createdSessionId });

                setTimeout(() => {
                  navigate($path('/'));
                }, 500);
                break;
              case 'missing_requirements':
                if (signInResponse.unverifiedFields.some((x) => x === 'email_address')) {
                  // TODO: Refactor this to use a switch to handle the unverified fields
                  // TODO: redirect to a enter email code page (check can we retrieve a sign in)
                  // TODO: create an email link verification page
                  await signUp.prepareEmailAddressVerification({
                    strategy: 'email_code',
                  });
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
          Verify email
        </Typography>
        <Typography variant={'mutedText'}>
          Enter the code we have sent to <strong>{signUp?.emailAddress}</strong>
        </Typography>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
            <FormField
              control={form.control}
              name='otp'
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
          </div>
          {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null}
          <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
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
