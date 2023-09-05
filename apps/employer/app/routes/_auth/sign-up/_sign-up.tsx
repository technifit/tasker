import { Link } from '@remix-run/react';
import { SignUpForm } from './forms/sign-up-form';
import { Typography } from '@technifit/ui';
import type { V2_MetaFunction } from '@vercel/remix';
import { SignUp } from '@clerk/remix';

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'Tasker | Sign Up' },
        { name: 'description', content: 'Sign up' },
    ];
};

export const Login = () => {
    return (
        <div className='flex flex-col gap-4 justify-center align-middle'>
            <div className="flexflex-col space-y-2 text-center">
                <Typography variant={'h1'} className="lg:text-2xl">
                    Create an account
                </Typography>
                <Typography variant={'mutedText'}>
                    Enter your email below to create your account
                </Typography>
            </div>
            {/* <SignUpForm /> */}
            <SignUp />
            <div className='flex flex-col gap-2 text-center'>
                <Typography variant={'mutedText'}>
                    Already have an account?{" "}
                    <Link
                        prefetch='intent'
                        to="/log-in"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign In
                    </Link>
                    .
                </Typography>
                <Typography variant={'mutedText'}>
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
            </div>
        </div>
    )
}

export default Login