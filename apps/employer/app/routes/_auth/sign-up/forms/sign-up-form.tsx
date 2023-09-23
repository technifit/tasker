import { isClerkAPIResponseError, useSignUp } from '@clerk/remix';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@technifit/ui';

import type { SignUpFormData } from '../schema/sign-up-form-schema';
import { signUpFormResolver as resolver } from '../schema/sign-up-form-schema';

export const SignUpForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const form = useRemixForm<SignUpFormData>({
    resolver,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    if (isLoaded) {
      e?.preventDefault();
      const { email, firstName, lastName, password } = form.getValues();

      try {
        const signInResponse = await signUp.create({
          firstName,
          lastName,
          password,
          emailAddress: email,
        });

        switch (signInResponse.status) {
          case 'complete':
            setActive({ session: signInResponse.createdSessionId });

            navigate($path('/'));
            break;
          case 'missing_requirements':
            if (signInResponse.unverifiedFields.some((x) => x === 'email_address')) {
              await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
              navigate($path('/otp'));
            }
            break;
          default:
            break;
        }
      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          console.error(error.message);
        } else {
          console.error('unknown error');
        }
      }
    }
  };

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={handleFormSubmit} className='flex w-full flex-col gap-4'>
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
        <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
          {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Form>
    </RemixFormProvider>
  );
};
