import { json, type DataFunctionArgs, type LinksFunction } from "@vercel/remix";
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
import { ClientHintCheck, getHints } from './utils/client-hints';
import { useNonce } from './utils/nonce-provider';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: DataFunctionArgs) {
  return json(
    {
      // user,
      requestInfo: {
        hints: getHints(request),
        // origin: getDomainUrl(request),
        // path: new URL(request.url).pathname,
        userPrefs: {
          // theme: getTheme(request),
        },
      },
    },
  )
}

export default function App() {
  const a = useLoaderData<typeof loader>();
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className='min-h-screen bg-background font-sans antialiased'>
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
