import { createCookieSessionStorage } from '@remix-run/node';

import { createSessionMiddleware } from '@technifit/middleware/session';
import type { SessionData, SessionFlashData } from '@technifit/middleware/session';

export const session = createSessionMiddleware(
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: '__session',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      secrets: [process.env.SESSION_SECRET!],
    },
  }),
);
