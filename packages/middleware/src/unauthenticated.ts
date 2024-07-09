import { redirect } from '@remix-run/node';
import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';

import { SessionContext } from './session';

/**
 * Middleware function that adds idempotency key to the session.
 * The idempotency key is used to ensure that a request with the same key is processed only once.
 */
async function withoutAuthentication({ context, next }: MiddlewareFunctionArgs) {
  const sessionContext = context.get(SessionContext);

  // If no session, set error and redirect to login
  if (sessionContext.get('access_token')) {
    throw redirect('/');
  }

  return next();
}

export { withoutAuthentication };
