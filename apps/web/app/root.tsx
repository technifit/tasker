import { ClerkApp } from '@clerk/remix';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';
import { publicEnvSchema } from 'server/env';

import { cn } from '@technifit/ui';

import { PublicEnvironment } from './lib/environment/public-env';
import styles from './styles/global.css?url';

const interWoff = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff`);
const interWoff2 = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff2`);

const fonts = [...interWoff, ...interWoff2];

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...fonts.map((font) => ({ rel: 'preload', href: `public/fonts/${font}` })),
];

export const loader = (args: LoaderFunctionArgs) => {
  return rootAuthLoader(
    args,
    () => {
      return {
        publicKeys: publicEnvSchema.parse(args.context.env),
      };
    },
    {
      publishableKey: args.context.env.CLERK_PUBLISHABLE_KEY,
      secretKey: args.context.env.CLERK_SECRET_KEY,
    },
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { publicKeys } = useLoaderData<typeof loader>();
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover' />
        <Meta />
        <Links />
        <PublicEnvironment publicEnvs={publicKeys} />
      </head>
      <body className={cn('flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased')}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return <Outlet />;
}

export default withSentry(ClerkApp(App), {
  errorBoundaryOptions: {
    fallback: <ErrorBoundary />,
  },
});

export function ErrorBoundary() {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>Unknown error</p>
    </>
  );
}
