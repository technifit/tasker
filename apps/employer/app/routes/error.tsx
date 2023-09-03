import { type LoaderArgs, type V2_MetaFunction } from '@vercel/remix';

import { Button } from '@technifit/ui';

// export const config = { runtime: 'edge' };

export const loader = ({ context, params, request }: LoaderArgs) => {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
        throw new Error("Sentry Backend Error");
    }

    return null;
};

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'New Remix App' },
        { name: 'description', content: 'Welcome to Remix!' },
    ];
};

export default function Index() {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
            <h1 className='text-3xl font-bold underline'>Welcome to Remix</h1>
            <Button
                variant={'destructive'}
                onClick={(e) => {
                    e.preventDefault();
                    throw new Error("Sentry Frontend Error");
                }}
            >
                Throw Error
            </Button>

        </div>
    );
}
