// sessions.server.tsx

import { createCookieSessionStorage } from '@remix-run/node';
import {
  createThemeAction,
  createThemeSessionResolver,
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__theme',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    secrets: [process.env.SESSION_SECRET!],
  },
});

const themeSessionResolver = createThemeSessionResolver(sessionStorage);

export { themeSessionResolver, ThemeProvider, useTheme, PreventFlashOnWrongTheme, createThemeAction, Theme };
