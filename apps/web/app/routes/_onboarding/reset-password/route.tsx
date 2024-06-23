import { zodResolver } from '@hookform/resolvers/zod';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, redirect } from '@remix-run/react';
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
import { InputPassword } from '@technifit/ui/input-password';
import { Typography } from '@technifit/ui/typography';

const resetPasswordSchema = z.object({
  newPassword: z
    .string({ required_error: 'Please enter your new password' })
    .min(10, { message: 'Password should be a minimum of 10 characters' }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const resolver = zodResolver(resetPasswordSchema);

const searchParamsSchema = z.object({
  token: z.string(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export const action = async ({
  request,
  context: {
    env: { WORKOS_API_KEY },
  },
}: LoaderFunctionArgs) => {
  const result = getSearchParams(request, searchParamsSchema);

  if (!result.success) {
    throw redirect($path('/forgot-password'));
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<ResetPasswordFormData>(request, resolver);
  if (errors) {
    return { errors, defaultValues };
  }

  const workos = new WorkOS(WORKOS_API_KEY);

  const { newPassword } = data;
  const token = result.data.token;

  try {
    const response = await workos.userManagement.resetPassword({
      newPassword,
      token,
    });
    console.log('🚀 ~ response:', response);

    return redirect($path('/log-in'));
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Log In' }, { name: 'description', content: 'Log in' }];
};

export const ResetPassword = () => {
  const form = useForm<ResetPasswordFormData>({
    resolver,
  });

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Reset Password
        </Typography>
        <Typography variant={'mutedText'}>Enter the code from your email and your new password</Typography>
      </div>
      <Form {...form}>
        <form method='POST' onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <InputPassword autoComplete='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null} */}
          <Button disabled={form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
      <Typography variant={'mutedText'} className='text-center'>
        Dont have an account?{' '}
        <Typography asChild variant={'link'}>
          <Link prefetch='intent' to={$path('/sign-up')}>
            Reset Password
          </Link>
        </Typography>
        .
      </Typography>
    </div>
  );
};

export default ResetPassword;
