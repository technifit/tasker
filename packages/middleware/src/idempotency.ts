import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';

import { newId } from '@technifit/id/new-id';

import { SessionContext } from './session';

/**
 * Middleware function that adds idempotency key to the session.
 * The idempotency key is used to ensure that a request with the same key is processed only once.
 */
async function idempotency({ context, next }: MiddlewareFunctionArgs) {
  const sessionContext = context.get(SessionContext);

  sessionContext.set('idempotency_key', newId('idempotency'));

  // return the response
  return next();
}

export { idempotency };
