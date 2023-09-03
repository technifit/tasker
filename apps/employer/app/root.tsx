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
import { Analytics } from '@vercel/analytics/react';
import { type LinksFunction } from '@vercel/remix';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';

import stylesheet from '~/styles/global.css';
import type { loader } from './_root.server';
import { THEME_ROUTE_PATH } from './routes/resources+/theme/_index';
import { ClientHintCheck } from './utils/client-hints';
import { useNonce } from './utils/nonce-provider';
import { PublicEnv } from './ui/public-env';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';

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
}

const App = () => {
  const {
    publicKeys,
  } = useLoaderData<typeof loader>();
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
      <body className='min-h-screen bg-background font-sans text-foreground antialiased'>
        <PublicEnv nonce={nonce} publicEnvs={publicKeys} />
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Analytics />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

const ErrorBoundary = () => {
  const {
    publicKeys,
  } = useLoaderData<typeof loader>();

  const error = useRouteError();
  const nonce = useNonce();
  const theme = useTheme()

  captureRemixErrorBoundaryError(error);

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
      <body className='min-h-screen bg-background font-sans text-foreground antialiased'>
        <PublicEnv nonce={nonce} publicEnvs={publicKeys} />
        <h1>Booom Error!</h1>
        <p>Make me pretty</p>
        <script
          nonce={nonce}
        // dangerouslySetInnerHTML={{
        // 	__html: `window.ENV = ${JSON.stringify(env)}`,
        // }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Analytics />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
};

export default withSentry(AppWithProviders, {
  errorBoundaryOptions: {
    fallback: ErrorBoundary,
  },
});
