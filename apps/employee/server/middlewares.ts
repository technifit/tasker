import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { cacheHeader } from 'pretty-cache-header';
import { getSession } from 'remix-hono/session';

/**
 * Creates a middleware that adds caching headers to the response.
 * @param seconds The number of seconds to cache the response.
 */
export const cache = (seconds: number) => {
  return createMiddleware(async (c, next) => {
    if (!c.req.path.match(/\.[a-zA-Z0-9]+$/) || c.req.path.endsWith('.data')) {
      return next();
    }

    await next();

    if (!c.res.ok) {
      return;
    }

    c.res.headers.set(
      'cache-control',
      cacheHeader({
        public: true,
        maxAge: `${seconds}s`,
      }),
    );
  });
};

/**
 * Middleware that handles the access token.
 * It retrieves the access token from the request URL's query parameters or from the session.
 * If the access token is not found, it throws an error.
 */
export const token = () => {
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

/**
 * Middleware function that adds idempotency key to the session if it doesn't exist.
 * The idempotency key is used to ensure that a request can be safely retried without
 * causing unintended side effects.
 */
export const idempotency = () => {
  return createMiddleware(async (c, next) => {
    const session = getSession(c);

    const existingIdempotencyKey = session.get('idempotencyKey') as string;

    if (!existingIdempotencyKey) {
      session.set('idempotencyKey', nanoid());
    }

    await next();
  });
};

/**
 * Generates a unique idempotency key and sets it in the session.
 * @param c The context object.
 * @returns The generated idempotency key.
 */
export const generateIdempotencyKey = (c: Context) => {
  const session = getSession(c);
  const newIdempotencyKey = nanoid();

  session.set('idempotencyKey', newIdempotencyKey);

  return newIdempotencyKey;
};
