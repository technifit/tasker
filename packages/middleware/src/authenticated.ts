import { redirect } from '@remix-run/node';
import type { AppLoadContext } from '@remix-run/node';
import type { ServerContext } from 'remix-create-express-app/context';
import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';
import { getClientIPAddress } from 'remix-utils/get-client-ip-address';

import { authenticateWithRefreshToken } from '@technifit/authentication/authenticate-with-refresh-token';
import { getJWKSURL } from '@technifit/authentication/get-jwks-url';
import { verifyAccessToken } from '@technifit/jwt/verify-access-token';

import { SessionContext } from './session';

/**
 * Clears the access_token and refresh_token from the session context and flashes an error message.
 * @param context - The AppLoadContext and ServerContext object.
 */
const setErrorSession = (context: AppLoadContext & ServerContext) => {
  const sessionContext = context.get(SessionContext);

  sessionContext.set('access_token', undefined);
  sessionContext.set('refresh_token', undefined);

  sessionContext.flash('error', 'You have been logged out.');
};

/**
 * Sets the error session and throws a redirect error to the '/log-in' page.
 *
 * @param {AppLoadContext & ServerContext} context - The application load context and server context.
 * @throws {RedirectError} - Throws a redirect error to the '/log-in' page.
 */
const setErrorSessionAndThrow = (context: AppLoadContext & ServerContext) => {
  setErrorSession(context);

  throw redirect('/log-in');
};

/**
 * Middleware function that checks if the user is authenticated.
 * If the user is authenticated, it calls the `next` function.
 * If the user is not authenticated, it sets an error and redirects to the login page.
 *
 * @param {MiddlewareFunctionArgs} args - The arguments for the middleware function.
 * @returns {Promise<void>} - A promise that resolves when the middleware is done.
 */
async function withAuthentication({ context, next, request }: MiddlewareFunctionArgs) {
  const sessionContext = context.get(SessionContext);

  // If no session, set error and redirect to login
  if (!sessionContext.get('access_token') || !sessionContext.get('refresh_token')) {
    console.error('No session found');
    setErrorSessionAndThrow(context);
  }

  // TODO: redactor to make the app load context types available to middleware
  const hasValidSession = await verifyAccessToken({
    accessToken: sessionContext.get('access_token')!,
    jkwsUrl: new URL(getJWKSURL()),
  });

  if (hasValidSession) {
    console.log('Session is valid');
    return next();
  }

  console.error('Session is invalid');

  // If the session is invalid (i.e. the access token has expired) attempt to re-authenticate with the refresh token
  try {
    console.log('Attempting to re-authenticate with refresh token');
    // Update the session with the refresh token
    const { accessToken, refreshToken } = await authenticateWithRefreshToken({
      refreshToken: sessionContext.get('refresh_token')!,
      userAgent: request.headers.get('user-agent')!,
      ipAddress: getClientIPAddress(request) ?? undefined,
    });

    console.log('Re-authenticated with refresh token');
    sessionContext.set('access_token', accessToken);
    sessionContext.set('refresh_token', refreshToken);
    // set the user & org on the session too

    return next();
  } catch (e) {
    console.error('Error re-authenticating with refresh token');
    console.error(e);
    setErrorSessionAndThrow(context);
  }
}

export { withAuthentication };
