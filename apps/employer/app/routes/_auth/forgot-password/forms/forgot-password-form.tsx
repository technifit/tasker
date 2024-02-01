import { useState } from 'react';
import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';
import type { ForgotPasswordFormData } from '../schema/forgot-password-form-schema';
import { forgotPasswordFormResolver as resolver } from '../schema/forgot-password-form-schema';

export const ForgotPasswordForm = () => {
  const { isLoaded, signIn } = useSignIn();
  const [error, setError] = useState<ErrorAlertProps | null>(null);

  const navigate = useNavigate();

  const form = useRemixForm<ForgotPasswordFormData>({
    resolver,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    if (isLoaded) {
      e?.preventDefault();
      const { email } = form.getValues();

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
  };

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={handleFormSubmit} className='flex w-full flex-col gap-4'>
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
        </div>
        {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null}
        <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
          {form.formState.isSubmitting ? 'Sending Password Reset Email...' : 'Get Password Reset Email'}
        </Button>
      </Form>
    </RemixFormProvider>
  );
};
