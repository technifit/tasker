import { createMiddleware } from 'hono/factory';
import { cacheHeader } from 'pretty-cache-header';

/**
 * Creates a middleware that adds caching headers to the response.
 * @param seconds The number of seconds to cache the response.
 */
const cache = (seconds: number) => {
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

export { cache };
