import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import { type LinksFunction } from '@vercel/remix';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';

import stylesheet from '~/styles/global.css';
import { THEME_ROUTE_PATH } from './routes/resources+/theme/_index';
import { ClientHintCheck } from './utils/client-hints';
import { useNonce } from './utils/nonce-provider';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export { loader } from './_root.server';

export default function AppWithProviders() {
  const {
    requestInfo: {
      userPrefs: { theme },
    },
  } = useLoaderData();
  return (
    <ThemeProvider specifiedTheme={theme} themeAction={THEME_ROUTE_PATH}>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const [theme] = useTheme();
  const nonce = useNonce();

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
        <Outlet />
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
}
