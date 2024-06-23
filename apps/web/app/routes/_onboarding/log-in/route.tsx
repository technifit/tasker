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

const logInFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
});

type LogInFormData = z.infer<typeof logInFormSchema>;

const resolver = zodResolver(logInFormSchema);

export const action = async ({
  request,
  context: {
    env: { WORKOS_API_KEY },
  },
}: ActionFunctionArgs) => {
  const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<LogInFormData>(request, resolver);
  if (errors) {
    return { errors, defaultValues };
  }

  const workos = new WorkOS(WORKOS_API_KEY);

  const { email } = data;
  try {
    await workos.userManagement.createMagicAuth({
      email,
    });

    return redirect($path('/magic-code', { email }));
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Log In' }, { name: 'description', content: 'Log in' }];
};

export const SignUp = () => {
  const form = useForm<LogInFormData>({
    resolver,
  });

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Sign in
        </Typography>
        <Typography variant={'mutedText'}>
          New to Tasker?{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to={$path('/sign-up')}>
              Sign up for an account
            </Link>
          </Typography>
          .
        </Typography>
      </div>
      <Form {...form}>
        <form method='POST' onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
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
            {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
