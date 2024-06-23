import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, redirect } from '@remix-run/react';
import { WorkOS } from '@workos-inc/node';
import { $path } from 'remix-routes';
import { getClientIPAddress } from 'remix-utils/get-client-ip-address';
import { z } from 'zod';

import { SessionContext } from '@technifit/middleware/session';
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
import { InputPassword } from '@technifit/ui/input-password';
import { Typography } from '@technifit/ui/typography';

const logInFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
  password: z.string({ required_error: 'Please enter your password' }).min(8),
});

type LogInFormData = z.infer<typeof logInFormSchema>;

const resolver = zodResolver(logInFormSchema);

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const {
    env: { WORKOS_API_KEY, WORKOS_CLIENT_ID },
  } = context;
  const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<LogInFormData>(request, resolver);
  if (errors) {
    return { errors, defaultValues };
  }

  const workos = new WorkOS(WORKOS_API_KEY);

  const { email, password } = data;
  try {
    const response = await workos.userManagement.authenticateWithPassword({
      email,
      password,
      clientId: WORKOS_CLIENT_ID,
      ipAddress: getClientIPAddress(request) ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });

    const sessionContext = context.get(SessionContext);
    sessionContext.set('access_token', response.accessToken);
    sessionContext.set('refresh_token', response.refreshToken);

    return redirect($path('/'));
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

  const { email } = form.watch();

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
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword autoComplete='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Typography asChild variant={'link'} className='text-sm'>
                <Link prefetch='intent' to={$path('/forgot-password', email ? { email } : undefined)}>
                  Forgot Password?
                </Link>
              </Typography>
            </div>
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
