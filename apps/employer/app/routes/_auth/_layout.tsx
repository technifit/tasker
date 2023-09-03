import { Link, Outlet } from '@remix-run/react';
import { Typography, buttonVariants, cn } from '@technifit/ui';

const Layout = () => {

    return <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
            prefetch='intent'
            to="/log-in"
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "absolute right-4 top-4 md:right-8 md:top-8"
            )}
        >
            Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
                <Link prefetch='intent' to='/' className='inline-flex gap-1 items-center'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    Tasker
                </Link>
            </div>
            <div className="relative z-20 mt-auto">
                <Typography variant={'blockquote'} className="space-y-2 text-primary-foreground">
                    <p className="text-lg">
                        &ldquo;This system has saved me countless hours of work and
                        helped me complete jobs for my clients faster than
                        ever before.&rdquo;
                    </p>
                    <footer className="text-sm">Joe Bloggs</footer>
                </Typography>
            </div>
        </div>
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <Outlet />
            </div>
        </div>
    </div>
}

export default Layout;