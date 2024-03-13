import { useState } from 'react';
import { isClerkAPIResponseError, useSignUp } from '@clerk/remix';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@technifit/ui';

import { ErrorAlert } from '~/ui/error-alert';
import type { ErrorAlertProps } from '~/ui/error-alert';
import type { SignUpFormData } from '../schema/sign-up-form-schema';
import { signUpFormResolver as resolver } from '../schema/sign-up-form-schema';

export const SignUpForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState<ErrorAlertProps | null>(null);
  const navigate = useNavigate();

  const form = useRemixForm<SignUpFormData>({
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
    <RemixFormProvider {...form}>
      <Form onSubmit={form.handleSubmit} className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col gap-2'>
          <div className='flex w-full flex-col gap-2 lg:flex-row'>
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
      </Form>
    </RemixFormProvider>
  );
};
