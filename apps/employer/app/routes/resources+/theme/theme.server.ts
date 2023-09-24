import { createCookieSessionStorage } from '@vercel/remix';
import * as cookie from 'cookie';
import { createThemeSessionResolver, Theme } from 'remix-themes';

import { getHints } from '~/utils/client-hints';

const cookieName = '__theme';

// TODO: tighten domain & secure before release
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: cookieName,
    // domain: 'remix.run',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: ['s3cr3t'],
    // secure: true,
  },
});

export async function getTheme(request: Request) {
  const { getTheme } = await themeSessionResolver(request);
  const { theme } = getHints(request);

  return getTheme() ? getTheme() : theme === 'light' ? Theme.LIGHT : Theme.DARK;
}

export function setTheme(theme?: Theme) {
  if (theme) {
    return cookie.serialize(cookieName, theme, { path: '/' });
  } else {
    return cookie.serialize(cookieName, '', { path: '/', maxAge: 0 });
  }
}

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
