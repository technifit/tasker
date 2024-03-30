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
import { useChangeLanguage } from 'remix-i18next/react';

import { cn } from '@technifit/ui';

// https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import './styles/global.css';

import { useTranslation } from 'react-i18next';

import { useReportSizeChangeToParent } from './hooks/use-report-size-change-to-parent';
import i18nextConfig from './i18n/i18next.server';
import { namespaces } from './i18n/resources';

const interWoff = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff`);
const interWoff2 = Array.from({ length: 9 }, (_, i) => `inter/inter-latin-ext-${i * 100 + 100}-normal.woff2`);

const fonts = [...interWoff, ...interWoff2];

export const links: LinksFunction = () => [...fonts.map((font) => ({ rel: 'preload', href: `public/fonts/${font}` }))];

export async function loader({ request, context: { theme } }: LoaderFunctionArgs) {
  const locale = await i18nextConfig.getLocale(request);

  return { locale, theme };
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: namespaces,
};

export function Layout({ children }: { children: React.ReactNode }) {
  // Get the locale from the loader
  const { ref } = useReportSizeChangeToParent<HTMLBodyElement>();
  const { locale, theme } = useLoaderData<typeof loader>();

  const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover' />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --background: ${theme.backgroundColor};
                --foreground: ${theme.foregroundColor};
                --card: ${theme.cardColor};
                --card-foreground: ${theme.cardForegroundColor};
                --popover: ${theme.popoverColor};
                --popover-foreground: ${theme.popoverForegroundColor};
                --primary: ${theme.primaryColor};
                --primary-foreground: ${theme.primaryForegroundColor};
                --secondary: ${theme.secondaryColor};
                --secondary-foreground: ${theme.secondaryForegroundColor};
                --muted: ${theme.mutedColor};
                --muted-foreground: ${theme.mutedForegroundColor};
                --accent: ${theme.accentColor};
                --accent-foreground: ${theme.accentForegroundColor};
                --destructive: ${theme.destructiveColor};
                --destructive-foreground: ${theme.destructiveForegroundColor};
                --border: ${theme.borderColor};
                --input: ${theme.inputColor};
                --ring: ${theme.ringColor};
                --radius: ${theme.radius};
              }
            `,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body ref={ref} className={cn('size-full h-dvh bg-background font-sans text-foreground antialiased')}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

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
