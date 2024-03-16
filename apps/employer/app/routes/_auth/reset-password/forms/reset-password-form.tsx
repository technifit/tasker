import { useState } from 'react';
import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { useNavigate } from '@remix-run/react';
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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  toast,
  useForm,
} from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';
import type { ResetPasswordFormData } from '../schema/reset-password-form-schema';
import { resetPasswordResolver as resolver } from '../schema/reset-password-form-schema';

export const ResetPasswordForm = () => {
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
  );
};
