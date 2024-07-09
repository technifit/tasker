import { redirect } from '@remix-run/node';
import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';

import { SessionContext } from './session';

/**
 * Middleware function that checks if the user is unauthenticated.
 * If the user has an access token, it throws a redirect to the dashboard page.
 * Otherwise, it calls the next middleware function.
 *
 * @param {MiddlewareFunctionArgs} args - The arguments for the middleware function.
 * @returns {Promise<void>} - A promise that resolves when the middleware function is complete.
 * @throws {RedirectError} - If the user has an access token, a redirect error is thrown.
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
