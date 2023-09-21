import { isClerkAPIResponseError, useSignUp } from '@clerk/remix';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';
import { z } from 'zod';

import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@technifit/ui';

import { OtpFormData, otpFormResolver as resolver } from '../schema/otp-form-schema';

export const OtpForm = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const navigate = useNavigate();

    const form = useRemixForm<OtpFormData>({
        resolver,
    });

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
        const isValid = await form.trigger();

        if (!isValid) {
            return;
        }

        if (isLoaded) {
            e?.preventDefault();
            const { otp } = form.getValues();

            try {
                const signInResponse = await signUp.attemptEmailAddressVerification({
                    code: otp,
                });

                switch (signInResponse.status) {
                    case 'complete':
                        setActive({ session: signInResponse.createdSessionId });

                        setTimeout(() => {
                            navigate($path('/'));
                        }, 500);
                        break;
                    case 'missing_requirements':
                        if (signInResponse.unverifiedFields.some((x) => x === 'email_address')) {
                            // TODO: Refactor this to use a switch to handle the unverified fields
                            // TODO: redirect to a enter email code page (check can we retrieve a sign in)
                            // TODO: create an email link verification page
                            await signUp.prepareEmailAddressVerification({
                                strategy: 'email_code',
                            });
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
                    <FormField
                        control={form.control}
                        name='otp'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input autoComplete='one-time-code' type='numeric' placeholder='12345' {...field} />
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
