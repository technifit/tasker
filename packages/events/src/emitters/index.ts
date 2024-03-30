import type { InternalEvent } from '../schema/event-schema';

/**
 * Emits an internal event by sending it to the parent window using postMessage.
 * @param event The internal event to be published.
 * @throws Error if no parent window is found.
 */
const emitInternalEvent = (event: InternalEvent) => {
  if (!window.parent) {
    console.error('No parent window found');
    return;
  }

  window.parent.postMessage(event, '*');
};

export { emitInternalEvent };
