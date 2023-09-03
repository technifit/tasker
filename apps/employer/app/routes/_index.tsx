import { Suspense } from 'react';
import { Await, useLoaderData } from '@remix-run/react';
import { defer, type LoaderArgs, type V2_MetaFunction } from '@vercel/remix';
import { Theme, useTheme } from 'remix-themes';

import { Badge, Button, Typography } from '@technifit/ui';

// export const config = { runtime: 'edge' };

export const loader = ({ context, params, request }: LoaderArgs) => {
  return defer({
    proxyRegion: new Promise<string>((resolve) =>
      setTimeout(() => resolve('EU'), 2500),
    ),
    computeRegion: new Promise<string>((resolve) =>
      setTimeout(() => resolve('IE'), 3500),
    ),
    date: new Date().toISOString(),
  });
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const { computeRegion, date, proxyRegion } = useLoaderData<typeof loader>();
  const [, setTheme] = useTheme();

  return (
    <div>
      <Typography variant={'h1'}>Welcome to Remix</Typography>
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
