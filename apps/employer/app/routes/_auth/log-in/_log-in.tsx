import { Link } from '@remix-run/react';
import { LoginForm } from './forms/log-in-form';
import { Typography } from '@technifit/ui';

export const SignUp = () => {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <Typography variant={'h1'} className="lg:text-2xl">
                    Sign in
                </Typography>
                <Typography variant={'p'} className="text-sm text-muted-foreground">
                    Enter your email below to access your account
                </Typography>
            </div>
            <LoginForm />
            <Typography variant={'p'} className="px-8 text-center text-sm text-muted-foreground">
                Dont have an account?{" "}
                <Link
                    prefetch='intent'
                    to="/sign-up"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Sign Up
                </Link>
                .
            </Typography>
        </>
    )
}

export default SignUp