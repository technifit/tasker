import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, redirect } from '@remix-run/react';
import { WorkOS } from '@workos-inc/node';
import { $path } from 'remix-routes';
import { z } from 'zod';

import { Button } from '@technifit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  getValidatedFormData,
  useForm,
} from '@technifit/ui/form';
import { Input } from '@technifit/ui/input';
import { Typography } from '@technifit/ui/typography';

const signUpFormSchema = z.object({
  firstName: z.string({ required_error: 'Please enter your first name' }).min(1),
  lastName: z.string({ required_error: 'Please enter your last name' }).min(1),
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

const resolver = zodResolver(signUpFormSchema);

export const action = async ({
  context: {
    env: { WORKOS_API_KEY },
  },
  request,
}: ActionFunctionArgs) => {
  const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<SignUpFormData>(request, resolver);
  if (errors) {
    return { errors, defaultValues };
  }

  const workos = new WorkOS(WORKOS_API_KEY);

  const { email, firstName, lastName } = data;
  try {
    await workos.userManagement.createUser({
      email,
      firstName,
      lastName,
    });

    await workos.userManagement.createMagicAuth({ email });

    return redirect($path('/magic-code', { email }));
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Sign Up' }, { name: 'description', content: 'Sign up' }];
};

export const Signup = () => {
  const form = useForm<SignUpFormData>({
    resolver,
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
        <form method='POST' onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
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
          </div>
          {/* {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null} */}
          <Button disabled={form.formState.isSubmitting} className='w-full'>
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
