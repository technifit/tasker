// middleware/session.ts
import type { Session, SessionStorage } from '@remix-run/node';
import { createContext } from 'remix-create-express-app/context';
import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';
import { z } from 'zod';

const sessionSchema = z.object({
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      profilePictureUrl: z.string().url().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .optional(),
});

type SessionData = z.infer<typeof sessionSchema>;

const sessionFlashSchema = z.object({
  error: z.string(),
});

type SessionFlashData = z.infer<typeof sessionFlashSchema>;

interface SessionMiddlewareArgs {
  isCookieSessionStorage: boolean;
}

// create SessionContext for use with context.get and .set
const SessionContext = createContext<Session<SessionData, SessionFlashData>>();

// creates session middleware that auto-commits the session cookie when mutated
function createSessionMiddleware(storage: SessionStorage) {
  const { getSession, commitSession } = storage;

  return async ({ request, context, next }: MiddlewareFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));
    type PropType = keyof typeof session;

    // setup a proxy to track if the session has been modified
    // so we can commit it back to the store
    const sessionProxy = {
      _isDirty: false,
      _data: JSON.stringify(session.data),
      get isDirty() {
        return this._isDirty || this._data !== JSON.stringify(session.data);
      },
      get(target: typeof session, prop: PropType) {
        this._isDirty ||= ['set', 'unset', 'destroy', 'flash'].includes(prop);
        return target[prop];
      },
    };

    const session$ = new Proxy(session, sessionProxy);

    // set the session context
    context.set(SessionContext, session$);

    const response = await next();

    if (sessionProxy.isDirty) {
      const result = await commitSession(session$);
      response.headers.append('Set-Cookie', result);
    }
    return response;
  };
}

export { createSessionMiddleware, SessionContext };
export type { SessionMiddlewareArgs, SessionData, SessionFlashData };
