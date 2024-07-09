import { startTransition, StrictMode, useEffect } from 'react';
import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { hydrateRoot } from 'react-dom/client';

import { getPublicEnv } from './lib/environment/public-env';

Sentry.init({
  dsn: getPublicEnv('SENTRY_DSN'),
  debug: getPublicEnv('NODE_ENV') === 'development',
  environment: getPublicEnv('NODE_ENV'),
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    // Replay is only available in the client
    Sentry.replayIntegration(),
    Sentry.sessionTimingIntegration(),
    Sentry.browserProfilingIntegration(),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
  // results in 25% of transactions being profiled (0.5*0.5=0.25)
  profilesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', 'https://technifit.dev', 'https://www.technifit.dev'],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

startTransition(() => {
  const App = (
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );

  hydrateRoot(document, App);
});
