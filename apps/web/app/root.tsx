import { createCookieSessionStorage } from '@remix-run/node';
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
import type { SentryMetaArgs } from '@sentry/remix';
import { $path } from 'remix-routes';
import { ExternalScripts } from 'remix-utils/external-scripts';
import { serverOnly$ } from 'vite-env-only/macros';

import { publicEnvSchema } from '@technifit/environment/schema';
import { createSessionMiddleware } from '@technifit/middleware/session';
import type { SessionData, SessionFlashData } from '@technifit/middleware/session';
import { PreventFlashOnWrongTheme, ThemeProvider, themeSessionResolver } from '@technifit/theme/theme-switcher';
import { cn } from '@technifit/ui/utils';

import { PublicEnvironment } from './lib/environment/public-env';
import styles from './styles/global.css?url';

const interWoff = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff`);
const interWoff2 = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff2`);

const fonts = [...interWoff, ...interWoff2];

const session = createSessionMiddleware(
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: '__session',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      secrets: [process.env.SESSION_SECRET!],
    },
  }),
);

// export your middleware as array of functions that Remix will call
// wrap middleware in serverOnly$ to prevent it from being bundled in the browser
// since remix doesn't know about middleware yet
export const middleware = serverOnly$([session]);

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...fonts.map((font) => ({ rel: 'preload', href: `public/fonts/${font}` })),
];

export const meta = ({ data }: SentryMetaArgs<MetaFunction<typeof loader>>) => {
  return [
    {
      name: 'sentry-trace',
      content: data.sentryTrace,
    },
    {
      name: 'baggage',
      content: data.sentryBaggage,
    },
  ];
};

// export const handle: ExternalScriptsHandle<SerializeFrom<typeof loader>> = {
//   scripts({
//     data: {
//       publicKeys: { CLOUDFLARE_ANALYTICS_TOKEN },
//     },
//   }) {
//     return [
//       {
//         src: 'https://static.cloudflareinsights.com/beacon.min.js',
//         'data-cf-beacon': `{"token": "${CLOUDFLARE_ANALYTICS_TOKEN}"}`,
//         defer: true,
//       },
//     ];
//   },
// };

export const loader = async ({ request, context: { env } }: LoaderFunctionArgs) => {
  const { getTheme } = await themeSessionResolver(request);

  return {
    theme: getTheme(),
    publicKeys: publicEnvSchema.parse(env),
  };
};

function App() {
  const { publicKeys, theme } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={theme} themeAction={$path('/set-theme')}>
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover' />
          <Meta />
          <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
          <Links />
          <PublicEnvironment publicEnvs={publicKeys} />
        </head>
        <body className={cn('flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased')}>
          <Outlet />
          <ScrollRestoration />
          <ExternalScripts />
          <Scripts />
          {publicKeys.NODE_ENV === 'production' && publicKeys.CLOUDFLARE_ANALYTICS_TOKEN ? (
            <script
              src='https://static.cloudflareinsights.com/beacon.min.js'
              data-cf-beacon={`{"token": "${publicKeys.CLOUDFLARE_ANALYTICS_TOKEN}"}`}
              defer
            />
          ) : null}
        </body>
      </html>
    </ThemeProvider>
  );
}

export default withSentry(App, {
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
