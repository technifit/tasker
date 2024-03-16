/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { startTransition, StrictMode, useEffect } from 'react';
import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { isbot } from 'isbot';
import { hydrateRoot } from 'react-dom/client';

import { getPublicEnv } from './ui/public-env';

if (!isbot) {
  Sentry.init({
    dsn: getPublicEnv('SENTRY_DSN'),
    environment: getPublicEnv('NODE_ENV'),
    integrations: [
      Sentry.browserProfilingIntegration(),
      Sentry.browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
      Sentry.replayIntegration({}),
    ],
    // Performance Monitoring
    tracesSampleRate: getPublicEnv('NODE_ENV') === 'production' ? 1.0 : 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: getPublicEnv('NODE_ENV') === 'production' ? 1.0 : 1.0, // This sets the sample rate at 10% in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    tracePropagationTargets: ['localhost'],
    // Set profilesSampleRate to 1.0 to profile every transaction.
    // Since profilesSampleRate is relative to tracesSampleRate,
    // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
    // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
    // results in 25% of transactions being profiled (0.5*0.5=0.25)
    profilesSampleRate: 1.0,
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
