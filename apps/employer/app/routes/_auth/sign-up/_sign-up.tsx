import { Link } from '@remix-run/react';
import { SignUpForm } from './forms/sign-up-form';
import { Typography } from '@technifit/ui';
import type { V2_MetaFunction } from '@vercel/remix';

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'Tasker | Sign Up' },
        { name: 'description', content: 'Sign up' },
    ];
};

export const Login = () => {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <Typography variant={'h1'} className="lg:text-2xl">
                    Create an account
                </Typography>
                <Typography variant={'p'} className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                </Typography>
            </div>
            <SignUpForm />
            <Typography variant={'p'} className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    prefetch='intent'
                    to="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    prefetch='intent'
                    to="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </Link>
                .
            </Typography>
        </>
    )
}

export default Login