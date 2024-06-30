import { redirect } from '@remix-run/node';
import type { AppLoadContext } from '@remix-run/node';
import { WorkOS } from '@workos-inc/node';
import type { ServerContext } from 'remix-create-express-app/context';
import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';

import { verifyAccessToken } from '@technifit/jwt/verify-access-token';

import { SessionContext } from './session';

// TODO: extract to authentication package -- https://linear.app/technifit/issue/TASK-105/add-auth-package-to-wrap-workos-calls
const authenticateWithRefreshToken = async (oldRefreshToken: string) => {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);

  const { accessToken, refreshToken } = await workos.userManagement.authenticateWithRefreshToken({
    clientId: process.env.WORKOS_CLIENT_ID!,
    refreshToken: oldRefreshToken,
  });

  return { accessToken, refreshToken };
};

const getJWKSURL = () => {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);

  const jwksURl = workos.userManagement.getJwksUrl(process.env.WORKOS_CLIENT_ID!);

  return jwksURl;
};

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
 * Middleware function that adds idempotency key to the session.
 * The idempotency key is used to ensure that a request with the same key is processed only once.
 */
async function withAuthentication({ context, next }: MiddlewareFunctionArgs) {
  const sessionContext = context.get(SessionContext);

  // If no session, set error and redirect to login
  if (!sessionContext.get('access_token') || !sessionContext.get('refresh_token')) {
    console.error('No session found');
    setErrorSessionAndThrow(context);
  }

  // TODO: redactor to make the app load contect types available to middleware
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
    // TODO: replace with call to authentication service -- https://linear.app/technifit/issue/TASK-105/add-auth-package-to-wrap-workos-calls
    const { accessToken, refreshToken } = await authenticateWithRefreshToken(sessionContext.get('refresh_token')!);

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
