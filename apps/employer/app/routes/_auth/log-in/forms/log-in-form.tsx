import { isClerkAPIResponseError, useSignIn } from '@clerk/remix';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useNavigate } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { $path } from 'remix-routes';
import { z } from 'zod';

import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from '@technifit/ui';

const schema = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .email()
        .nonempty(),
    password: z.string({ required_error: 'Please enter your password' }).min(8),
});

type FormData = z.infer<typeof schema>;

const resolver = zodResolver(schema);

export const LoginForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const navigate = useNavigate();

    const form = useRemixForm<FormData>({
        mode: 'onSubmit',
        resolver,
    });

    //const { getValues } = useRemixFormContext<FormData>();

    const handleFormSubmit = async (
        e: React.FormEvent<HTMLFormElement> | undefined,
    ) => {
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

                    navigate($path('/'));
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
                <div className='w-full flex flex-col gap-2'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete='email'
                                        type='email'
                                        placeholder='joe.blogs@org.com'
                                        {...field}
                                    />
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
                                    <Input autoComplete='email' type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    disabled={!isLoaded || form.formState.isSubmitting}
                    className='w-full'
                >
                    {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
            </Form>
        </RemixFormProvider>
    );
};
