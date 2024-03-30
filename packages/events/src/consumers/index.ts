import { internalEventSchema } from '../schema/event-schema';
import type { InternalEvent } from '../schema/event-schema';

type Handler<T extends InternalEvent['type']> = (payload: Extract<InternalEvent, { type: T }>['payload']) => void;

type Handlers = {
  [T in InternalEvent['type']]?: Handler<T>[];
};

const createInternalEventConsumer = () => {
  const handlers: Handlers = {};

  /**
   * Registers an event handler for a specific event type.
   *
   * @template T - The type of the event.
   * @param {T} eventType - The type of the event to handle.
   * @param {Handler<T>} handler - The event handler function.
   */
  const on = <T extends InternalEvent['type']>(eventType: T, handler: Handler<T>) => {
    if (!handlers[eventType]) {
      handlers[eventType] = [];
    }
    handlers[eventType]!.push(handler);
  };

  const internalEventMessageHandler = (event: MessageEvent<unknown>) => {
    const parsedInternalEvent = internalEventSchema.safeParse(event.data);

    if (parsedInternalEvent.success) {
      const eventHandlers = handlers[parsedInternalEvent.data.type];
      if (eventHandlers) {
        eventHandlers.forEach((handler) => {
          const handlerTyped = handler as Handler<typeof parsedInternalEvent.data.type>;
          handlerTyped(parsedInternalEvent.data.payload);
        });
      }
    } else {
      console.error('Received invalid event', event.data);
    }
  };

  const consumeInternalEvents = () => {
    if (!window) {
      console.error('No window found');
      return;
    }

    window.addEventListener('message', (e) => internalEventMessageHandler(e));
  };

  // Automatically consume internal events upon creation
  consumeInternalEvents();

  return {
    on,
  };
};

export { createInternalEventConsumer };
