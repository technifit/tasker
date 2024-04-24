import { createMiddleware } from 'hono/factory';
import { getSession } from 'remix-hono/session';

/**
 * Middleware that handles the access token.
 * It retrieves the access token from the request URL's query parameters or from the session.
 * If the access token is not found, it throws an error.
 */
const accessToken = () => {
  return createMiddleware(async (c, next) => {
    const session = getSession(c);

    const accessToken = new URL(c.req.url).searchParams.get('accessToken');
    const existingToken = session.get('accessToken') as string;

    if (accessToken) {
      session.set('accessToken', accessToken);
    } else if (existingToken) {
      session.set('accessToken', existingToken);
    } else {
      throw new Error('Access token is required');
    }

    await next();
  });
};

export { accessToken };
