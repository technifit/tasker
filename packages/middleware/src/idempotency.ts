import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { getSession } from 'remix-hono/session';

import { newId } from '@technifit/id/new-id';

/**
 * Middleware function that adds idempotency key to the session if it doesn't exist.
 * The idempotency key is used to ensure that a request with the same key is processed only once.
 */
const idempotency = () => {
  return createMiddleware(async (c, next) => {
    const session = getSession(c);

    const existingIdempotencyKey = session.get('idempotencyKey') as string;

    if (!existingIdempotencyKey) {
      session.set('idempotencyKey', newId('idempotency'));
    }

    await next();
  });
};

/**
 * Generates a unique idempotency key and sets it in the session.
 * @param c The context object.
 * @returns The generated idempotency key.
 */
const generateIdempotencyKey = (c: Context) => {
  const session = getSession(c);
  const newIdempotencyKey = newId('idempotency');

  session.set('idempotencyKey', newIdempotencyKey);

  return newIdempotencyKey;
};

/**
 * Retrieves the idempotency key from the session.
 * Throws an error if no idempotency key is found.
 *
 * @param c - The context object.
 * @returns The idempotency key.
 * @throws Error if no idempotency key is found in the session.
 */
const getIdempotencyKey = (c: Context) => {
  const session = getSession(c);
  const idempotencyKey = session.get('idempotencyKey') as string;

  if (!idempotencyKey) {
    throw new Error('No idempotency key found in the session');
  }

  return idempotencyKey;
};

export { idempotency, generateIdempotencyKey, getIdempotencyKey };
