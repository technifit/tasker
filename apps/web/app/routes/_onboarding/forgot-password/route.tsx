import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { WorkOS } from '@workos-inc/node';
import { getSearchParams } from 'remix-params-helper';
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

const forgotPasswordFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
});

const forgotPasswordSearchParamsSchema = z.object({
  email: z.string().email().optional(),
});

export type SearchParams = z.infer<typeof forgotPasswordSearchParamsSchema>;

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

const resolver = zodResolver(forgotPasswordFormSchema);

export const loader = ({ request }: LoaderFunctionArgs) => {
  const { success, data } = getSearchParams(request, forgotPasswordSearchParamsSchema);

  return { email: success && data.email ? data.email : undefined };
};

export const action = async ({
  request,
  context: {
    env: { WORKOS_API_KEY },
  },
}: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<ForgotPasswordFormData>(request, resolver);
  if (errors) {
    return { errors, defaultValues };
  }

  const workos = new WorkOS(WORKOS_API_KEY);

  const { email } = data;
  try {
    const response = await workos.userManagement.createPasswordReset({
      email,
    });
    console.log('🚀 ~ response:', response);

    return redirect($path('/reset-password'));
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Forgot Password' }, { name: 'description', content: 'Forgot Password' }];
};

export const ForgotPassword = () => {
  const { email } = useLoaderData<typeof loader>();

  const form = useForm<ForgotPasswordFormData>({
    resolver,
    defaultValues: {
      email,
    },
  });

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Forgot your password?
        </Typography>
        <Typography variant={'mutedText'}>We will have you up and running in no time</Typography>
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
            {form.formState.isSubmitting ? 'Sending Password Reset Email...' : 'Get Password Reset Email'}
          </Button>
        </form>
      </Form>
      <Typography variant={'mutedText'} className='text-center'>
        Dont have an account?{' '}
        <Typography asChild variant={'link'}>
          <Link prefetch='intent' to={$path('/sign-up')}>
            Sign Up
          </Link>
        </Typography>
        .
      </Typography>
    </div>
  );
};

export default ForgotPassword;
