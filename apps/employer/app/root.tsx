import { ClerkApp, ClerkErrorBoundary } from '@clerk/remix';
import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from '@remix-run/react';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';
import { Analytics } from '@vercel/analytics/react';
import type { LinksFunction, LoaderFunctionArgs } from '@vercel/remix';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes';

import { cn, Toaster } from '@technifit/ui';

// https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import '~/styles/global.css';

import { rootAuthLoader } from '@clerk/remix/ssr.server';

import { getPublicKeys } from './lib/environment/environment';
import { THEME_ROUTE_PATH } from './routes/resources+/theme/_index';
import { getTheme } from './routes/resources+/theme/theme.server';
import { PublicEnv } from './ui/public-env';
import { TailwindIndicator } from './ui/tailwind-indicator';
import { ClientHintCheck, getHints } from './utils/client-hints';
import { useNonce } from './utils/nonce-provider';

const calSans = ['cal-sans/CalSans-SemiBold.woff', 'cal-sans/CalSans-SemiBold.woff2'];
const interWoff = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff`);
const interWoff2 = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff2`);

const fonts = [...calSans, ...interWoff, ...interWoff2];

export const links: LinksFunction = () => [...fonts.map((font) => ({ rel: 'preload', href: `/fonts/${font}` }))];

export const loader = async (args: LoaderFunctionArgs) => {
  return rootAuthLoader(args, async ({ request }) => {
    return json({
      // user,
      requestInfo: {
        hints: getHints(request),
        // origin: getDomainUrl(request),
        // path: new URL(request.url).pathname,
        userPrefs: {
          theme: await getTheme(request),
        },
      },
      publicKeys: {
        ...getPublicKeys(),
      },
    });
  });
};

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
    <html lang='en' className={`${theme} h-dvh overflow-x-hidden`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
        <Links />
      </head>
      <body className={cn('flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased')}>
        <PublicEnv nonce={nonce} publicEnvs={publicKeys} />
        <Outlet />
        <TailwindIndicator />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Toaster />
        <Analytics />
        <SpeedInsights />
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
      <body className='min-h-dvh bg-background font-sans text-foreground antialiased'>
        <h1>Booom Error!</h1>
        <p>Make me pretty</p>
      </body>
    </html>
  );
};

export const ErrorBoundary = ClerkErrorBoundary(BaseErrorBoundary);

export default withSentry(ClerkApp(AppWithProviders), {
  errorBoundaryOptions: {
    fallback: <ErrorBoundary />,
  },
});
