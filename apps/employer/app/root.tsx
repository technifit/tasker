import { ClerkApp, V2_ClerkErrorBoundary } from '@clerk/remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';
import { Analytics } from '@vercel/analytics/react';
import { type LinksFunction } from '@vercel/remix';
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes';

import { cn } from '@technifit/ui';

import stylesheet from '~/styles/global.css';
import type { loader } from './_root.server';
import { THEME_ROUTE_PATH } from './routes/resources+/theme/_index';
import { PublicEnv } from './ui/public-env';
import { TailwindIndicator } from './ui/tailwind-indicator';
import { ClientHintCheck } from './utils/client-hints';
import { useNonce } from './utils/nonce-provider';

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: '/fonts/cal-sans/CalSans-SemiBold.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/cal-sans/CalSans-SemiBold.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-100-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-100-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-200-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-200-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-300-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-300-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-400-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-400-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-500-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-500-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-600-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-600-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-700-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-700-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-800-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-800-normal.woff2',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-900-normal.woff',
  },
  {
    rel: 'preload',
    href: '/fonts/inter/inter-latin-ext-900-normal.woff2',
  },
  { rel: 'stylesheet', href: stylesheet },
];

export { loader } from './_root.server';

const AppWithProviders = () => {
  const {
    requestInfo: {
      userPrefs: { theme },
    },
  } = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={theme} themeAction={THEME_ROUTE_PATH}>
      <App />
    </ThemeProvider>
  );
};

const App = () => {
  const { publicKeys } = useLoaderData<typeof loader>();
  let nonce = useNonce();
  const [theme] = useTheme();

  if (typeof document !== 'undefined') {
    nonce = '';
  }

  return (
    <html lang='en' className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
        <Links />
      </head>
      <body className={cn('min-h-screen bg-background font-sans text-foreground antialiased')}>
        <PublicEnv nonce={nonce} publicEnvs={publicKeys} />
        <div className='relative flex min-h-screen flex-col'>
          <div className='flex flex-1'>
            <Outlet />
          </div>
        </div>
        <TailwindIndicator />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Analytics />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
};

const BaseErrorBoundary = () => {
  const error = useRouteError();

  captureRemixErrorBoundaryError(error);

  return (
    <html lang='en' className={`h-full overflow-x-hidden`}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='min-h-screen bg-background font-sans text-foreground antialiased'>
        <h1>Booom Error!</h1>
        <p>Make me pretty</p>
      </body>
    </html>
  );
};

export const ErrorBoundary = V2_ClerkErrorBoundary(BaseErrorBoundary);

export default withSentry(ClerkApp(AppWithProviders), {
  errorBoundaryOptions: {
    fallback: <ErrorBoundary />,
  },
});
