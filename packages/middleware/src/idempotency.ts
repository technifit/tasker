import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';

import { newId } from '@technifit/id/new-id';

/**
 * Middleware function that adds idempotency key to the session.
 * The idempotency key is used to ensure that a request with the same key is processed only once.
 */
async function idempotency({ next }: MiddlewareFunctionArgs) {
  console.log('idempotency', newId('idempotency'));

  // return the response
  return next();
}

export { idempotency };
