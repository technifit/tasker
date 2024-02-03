import { RemixServer } from '@remix-run/react';
import { captureConsoleIntegration } from '@sentry/integrations';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/remix';
import { handleRequest } from '@vercel/remix';
import type { DataFunctionArgs, EntryContext } from '@vercel/remix';
import { isbot } from 'isbot';
import { nanoid } from 'nanoid';
import { cacheHeader } from 'pretty-cache-header';
import { isPrefetch } from 'remix-utils/is-prefetch';

import { environment } from './lib/environment/environment.server';
import { NonceProvider } from './utils/nonce-provider';

if (!isbot) {
  Sentry.init({
    dsn: environment().SENTRY_DSN,
    // Performance Monitoring
    tracesSampleRate: environment().NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1,
    integrations: [
      new ProfilingIntegration(),
      captureConsoleIntegration({
        levels: ['error'],
      }),
    ],
  });
}

export default function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  //? NOTE: shelved secure generation pending: https://github.com/ai/nanoid/discussions/443
  const nonce = nanoid();

  const remixServer = (
    <NonceProvider value={nonce}>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>
  );

  // Set a short cache for prefetch requests to avoid double data requests
  if (isPrefetch(request)) {
    responseHeaders.set(
      'Cache-Control',
      cacheHeader({
        private: true,
        maxAge: '5s',
        sMaxage: '0s',
      }),
    );
  }

  // Set a vary header to avoid caching issues with cookies
  responseHeaders.set('Vary', 'Cookie');
  // Set a noindex header to avoid indexing of the site
  responseHeaders.set('X-Robots-Tag', 'noindex');
  // Set a document policy header to enable js profiling on the browser
  responseHeaders.set('Document-Policy', 'js-profiling');

  return handleRequest(request, responseStatusCode, responseHeaders, remixServer);
}

export function handleError(error: unknown, { request }: DataFunctionArgs): void {
  if (error instanceof Error) {
    void Sentry.captureRemixServerException(error, 'remix.server', request);
  } else {
    // Optionally capture non-Error objects
    Sentry.captureException(error);
  }
}
