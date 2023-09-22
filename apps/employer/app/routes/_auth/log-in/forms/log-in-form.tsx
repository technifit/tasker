import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { Form, Link, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@technifit/ui';

import { LogInFormData, logInFormResolver as resolver } from '../schema/log-in-form-schema';

export const LoginForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const form = useRemixForm<LogInFormData>({
    resolver,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    if (isLoaded) {
      e?.preventDefault();
      const { email, password } = form.getValues();

      try {
        const signInResponse = await signIn.create({
          identifier: email,
          password,
        });

        if (signInResponse.status === 'complete') {
          setActive({ session: signInResponse.createdSessionId });

          setTimeout(() => {
            navigate($path('/'));
          }, 500);
        } else if (signInResponse.status === 'needs_new_password') {
          console.log('invalid password!');
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
          <div className='flex flex-col gap-1'>
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
            <Link
              prefetch='intent'
              to={$path('/forgot-password')}
              className='text-sm underline underline-offset-4 hover:text-primary'
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
          {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </Form>
    </RemixFormProvider>
  );
};
