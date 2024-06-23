import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { WorkOS } from '@workos-inc/node';
import { getSearchParams } from 'remix-params-helper';
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
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@technifit/ui/input-otp';
import { Typography } from '@technifit/ui/typography';

const otpFormSchema = z.object({
  otp: z
    .string({ required_error: 'Please enter your one time password' })
    .min(6, { message: 'Code shold be 6 characters' })
    .max(6, { message: 'Code shold be 6 characters' }),
});

type OtpFormData = z.infer<typeof otpFormSchema>;

const resolver = zodResolver(otpFormSchema);

const searchParamsSchema = z.object({
  email: z.string(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export const loader = ({ request }: LoaderFunctionArgs) => {
  const result = getSearchParams(request, searchParamsSchema);

  if (!result.success) {
    throw redirect($path('/log-in'));
  }

  return {
    email: result.data.email,
  };
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const {
    env: { WORKOS_API_KEY, WORKOS_CLIENT_ID },
  } = context;
  const result = getSearchParams(request, searchParamsSchema);

  if (!result.success) {
    return redirect($path('/log-in'));
  }

  const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<OtpFormData>(request, resolver);
  if (errors) {
    return { errors, defaultValues };
  }

  const workos = new WorkOS(WORKOS_API_KEY);

  const { otp } = data;
  try {
    const response = await workos.userManagement.authenticateWithMagicAuth({
      code: otp,
      clientId: WORKOS_CLIENT_ID,
      ipAddress: getClientIPAddress(request) ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
      email: result.data.email,
    });

    const sessionContext = context.get(SessionContext);
    sessionContext.set('access_token', response.accessToken);
    sessionContext.set('refresh_token', response.refreshToken);

    // TODO: set cookie here to say user is logged in - https://linear.app/technifit/issue/TASK-106/set-cookie-when-logged-inotp-verified
    return redirect($path('/'));
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | One Time Password' }, { name: 'description', content: 'One Time Password' }];
};

export const Otp = () => {
  const { email } = useLoaderData<typeof loader>();
  const form = useForm<OtpFormData>({
    resolver,
  });

  return (
    <div className='flex w-full max-w-md flex-col items-start justify-center gap-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant={'h1'} className='lg:text-2xl'>
          Check your email
        </Typography>
        <Typography variant={'mutedText'}>
          Enter the code we have sent to <strong>{email ?? 'your email address'}</strong>
        </Typography>
      </div>
      <Form {...form}>
        <form method='POST' onSubmit={form.handleSubmit} className='flex w-full flex-col gap-6'>
          <div className='flex w-full flex-col gap-3'>
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      autoComplete='one-time-code'
                      type='numeric'
                      maxLength={6}
                      render={({ slots }) => (
                        <>
                          <InputOTPGroup>
                            {slots.slice(0, 3).map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}{' '}
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            {slots.slice(3).map((slot, index) => (
                              <InputOTPSlot key={index + 3} {...slot} />
                            ))}
                          </InputOTPGroup>
                        </>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* {error ? <ErrorAlert heading={error.heading} description={error.description} /> : null} */}
          <Button disabled={form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Confirming Code...' : 'Confirm Code'}
          </Button>
        </form>
      </Form>
      <div className='flex flex-col gap-2 text-center'>
        <Typography variant={'mutedText'}>
          Already have an account?{' '}
          <Typography asChild variant={'link'}>
            <Link prefetch='intent' to={$path('/log-in')}>
              Sign In
            </Link>
          </Typography>
          .
        </Typography>
      </div>
    </div>
  );
};

export default Otp;
