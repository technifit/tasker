import { Await, useLoaderData } from '@remix-run/react';
import { defer, type LoaderArgs, type V2_MetaFunction } from "@vercel/remix";
import { Suspense } from 'react';

export const config = { runtime: 'edge' };

export const loader = ({ context, params, request }: LoaderArgs) => {

  return defer({
    proxyRegion: new Promise<string>((resolve) => setTimeout(() => resolve("EU"), 2500)),
    computeRegion: new Promise<string>((resolve) => setTimeout(() => resolve("IE"), 3500)),
    date: new Date().toISOString(),
  });
}

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { computeRegion, date, proxyRegion } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className='text-3xl font-bold underline'>Welcome to Remix</h1>
      <ul>
        <li>
          <span>{date}</span>
        </li>
        <li>
          <Suspense fallback={<strong>Loading...</strong>}>
            <Await resolve={proxyRegion}>
              {(proxyRegion) => <p>{proxyRegion}</p>}
            </Await>
          </Suspense>
        </li>
        <li>
          <Suspense fallback={<strong>Loading...</strong>}>
            <Await resolve={computeRegion}>
              {(computeRegion) => <p>{computeRegion}</p>}
            </Await>
          </Suspense>
        </li>
      </ul>
    </div>
  );
}
