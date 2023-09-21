import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, useToast } from '@technifit/ui';

import { ResetPasswordFormData, resetPasswordResolver as resolver } from '../schema/reset-password-form-schema';

export const ResetPasswordForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useRemixForm<ResetPasswordFormData>({
        resolver,
    });

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
        const isValid = await form.trigger();

        if (!isValid) {
            return;
        }

        if (isLoaded) {
            e?.preventDefault();
            const { code, password } = form.getValues();

            try {
                const signInResponse = await signIn.attemptFirstFactor({
                    strategy: 'reset_password_email_code',
                    code,
                    password,
                });

                if (signInResponse.status === 'complete') {
                    setActive({ session: signInResponse.createdSessionId });

                    toast({
                        title: 'Password Updated',
                        description: 'You will be redirected to the dashboard',
                    });

                    setTimeout(() => {
                        navigate($path('/log-in'));
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
                        name='code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input autoComplete='one-time-code' type='numeric' placeholder='123456' {...field} />
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
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input autoComplete='password' type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={!isLoaded || form.formState.isSubmitting} className='w-full'>
                    {form.formState.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
            </Form>
        </RemixFormProvider>
    );
};
