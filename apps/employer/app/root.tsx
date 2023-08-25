import { type LinksFunction } from "@vercel/remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles/global.css";
import { ClientHintCheck } from './utils/client-hints';
import { useNonce } from './utils/nonce-provider';
import { ThemeProvider, useTheme, PreventFlashOnWrongTheme } from 'remix-themes'
import { THEME_ROUTE_PATH } from './routes/resources+/theme/_index';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export { loader } from './_root.server';

export default function AppWithProviders() {
  const { requestInfo: { userPrefs: { theme } } } = useLoaderData()
  return (
    <ThemeProvider specifiedTheme={theme} themeAction={THEME_ROUTE_PATH}>
      <App />
    </ThemeProvider>
  )
}

function App() {
  const [theme] = useTheme()
  const nonce = useNonce();

  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
        <Links />
      </head>
      <body className='min-h-screen bg-background text-foreground font-sans antialiased'>
        <Outlet />
        <script
          nonce={nonce}
        // dangerouslySetInnerHTML={{
        // 	__html: `window.ENV = ${JSON.stringify(env)}`,
        // }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
