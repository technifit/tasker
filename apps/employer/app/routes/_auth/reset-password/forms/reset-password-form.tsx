import { useState } from 'react';
import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, toast } from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';
import type { ResetPasswordFormData } from '../schema/reset-password-form-schema';
import { resetPasswordResolver as resolver } from '../schema/reset-password-form-schema';

export const ResetPasswordForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<ErrorAlertProps | null>(null);
  const navigate = useNavigate();

  const form = useRemixForm<ResetPasswordFormData>({
    resolver,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    if (isLoaded) {
      e?.preventDefault();
      const { code, password } = form.getValues();

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
            navigate($path('/log-in'));
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
  };

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={handleFormSubmit} className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col gap-2'>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input autoComplete='one-time-code' type='numeric' placeholder='123456' {...field} />
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
      </Form>
    </RemixFormProvider>
  );
};
