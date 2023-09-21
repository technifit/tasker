import { Link } from '@remix-run/react';
import { Typography } from '@technifit/ui';
import type { V2_MetaFunction } from '@vercel/remix';
import { $path } from 'remix-routes';
import { ForgotPasswordForm } from './forms/forgot-password-form';

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'Tasker | Forgot Password' },
        { name: 'description', content: 'Forgot Password' },
    ];
};

export const ForgotPassword = () => {
    return (
        <div className='w-full flex flex-col gap-4 justify-center items-center max-w-md'>
            <div className="flex flex-col space-y-2 text-center">
                <Typography variant={'h1'} className="lg:text-2xl">
                    Forgot your password?
                </Typography>
                <Typography variant={'mutedText'}>
                    We will have you up and running in no time
                </Typography>
            </div>
            <ForgotPasswordForm />
            <Typography variant={'mutedText'} className="text-center">
                Dont have an account?{" "}
                <Link
                    prefetch='intent'
                    to={$path('/sign-up')}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Sign Up
                </Link>
                .
            </Typography>
        </div>
    )
}

export default ForgotPassword