import { Link, Outlet } from '@remix-run/react';
import { LogIn, Typography, buttonVariants, cn } from '@technifit/ui';
import { $path } from 'remix-routes';

const Layout = () => {

    return <div className='container py-4 grid grid-cols-1 lg:grid-cols-2'>
        <div className='hidden lg:flex lg:flex-col lg:justify-between lg:gap-2'>
            <div className='flex justify-start'>
                <Link prefetch='intent' to={$path('/')} className='inline-flex gap-1 items-center'>
                    Tasker
                </Link>
            </div>
            <Typography variant={'blockquote'} className="mb-4">
                <Typography className="text-lg">
                    &ldquo;This system has saved me countless hours of work and
                    helped me complete jobs for my clients faster than
                    ever before.&rdquo;
                </Typography>
                <footer className="text-sm">Joe Bloggs</footer>
            </Typography>
        </div>
        <div className='flex flex-col gap-2'>
            <div className='flex justify-end'>
                <Link
                    prefetch='intent'
                    to={$path('/log-in')}
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        'inline-flex gap-1 items-center'
                    )}
                >
                    <LogIn className='h-4 w-4' />
                    Login
                </Link>
            </div>
            <div className='grow flex flex-col justify-center align-middle'>
                <Outlet />
            </div>
        </div>
    </div>
}

export default Layout;