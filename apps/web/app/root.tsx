import { ClerkApp } from '@clerk/remix';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { createCookieSessionStorage } from '@remix-run/node';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
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
import { serverOnly$ } from 'vite-env-only/macros';

import { publicEnvSchema } from '@technifit/environment/schema';
import { idempotency } from '@technifit/middleware/idempotency';
import { createSessionMiddleware } from '@technifit/middleware/session';
import type { SessionData, SessionFlashData } from '@technifit/middleware/session';
import { cn } from '@technifit/ui/utils';

import { PublicEnvironment } from './lib/environment/public-env';
import styles from './styles/global.css?url';

const interWoff = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff`);
const interWoff2 = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff2`);

const fonts = [...interWoff, ...interWoff2];

const session = createSessionMiddleware(
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: '__tasker_session',
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      secrets: [process.env.SESSION_SECRET ?? '6b063bce-33b8-454f-84ba-baf1aa28e4cd'],
    },
  }),
);

// export your middleware as array of functions that Remix will call
// wrap middleware in serverOnly$ to prevent it from being bundled in the browser
// since remix doesn't know about middleware yet
export const middleware = serverOnly$([session, idempotency]);

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

function App() {
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default withSentry(ClerkApp(App, { clerkJSVariant: 'headless' }), {
  errorBoundaryOptions: {
    fallback: <ErrorBoundary />,
  },
});

export function ErrorBoundary() {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);

  if (isRouteErrorResponse(error)) {
    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover' />
        </head>
        <body className={cn('flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased')}>
          <main className='container grid grow grid-cols-1 py-4 lg:grid-cols-1'>
            <div className='flex flex-col gap-2'>
              <div className='flex grow flex-col items-center justify-center'>
                <h1>
                  {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
              </div>
            </div>
          </main>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover' />
      </head>
      <body className={cn('flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased')}>
        <main className='container grid grow grid-cols-1 py-4 lg:grid-cols-1'>
          <div className='flex flex-col gap-2'>
            <div className='flex grow flex-col items-center justify-center'>
              <h1>Error</h1>
              <p>Unknown Error</p>
            </div>
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
