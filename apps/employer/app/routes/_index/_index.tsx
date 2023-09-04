import { Suspense } from 'react';
import { Await, useLoaderData } from '@remix-run/react';
import { type V2_MetaFunction } from '@vercel/remix';
import { Theme, useTheme } from 'remix-themes';

import { Badge, Button, Typography } from '@technifit/ui';
import type { loader } from './_index.server'
import { useUser } from '@clerk/remix';

// export const config = { runtime: 'edge' };

export { loader } from './_index.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Tasker' },
    { name: 'description', content: 'Large scale job processing done right' },
  ];
};

export const Index = () => {
  const { computeRegion, date, proxyRegion } = useLoaderData<typeof loader>();
  const { isSignedIn } = useUser();
  const [, setTheme] = useTheme();

  return (
    <div className='container'>
      <Typography variant={'h1'}>Welcome to Remix</Typography>
      {isSignedIn ? <Badge variant={'secondary'}>Logged in</Badge> : null}
      <Button
        onClick={(e) => {
          e.preventDefault();
          setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK));
        }}
      >
        Switch Theme
      </Button>
      <Typography variant={'ul'}>
        <li>
          <span>{date}</span>
        </li>
        <li>
          <Suspense fallback={<strong>Loading...</strong>}>
            <Await resolve={proxyRegion}>
              {(proxyRegion) => (
                <Badge variant={'secondary'}>{proxyRegion}</Badge>
              )}
            </Await>
          </Suspense>
        </li>
        <li>
          <Suspense fallback={<strong>Loading...</strong>}>
            <Await resolve={computeRegion}>
              {(computeRegion) => (
                <Badge variant={'default'}>{computeRegion}</Badge>
              )}
            </Await>
          </Suspense>
        </li>
      </Typography>
    </div>
  );
}

export default Index
