import type { ActionFunction } from '@remix-run/node';
import { createThemeAction } from 'remix-themes';
import { themeSessionResolver } from 'server/theme.server';

export const action: ActionFunction = createThemeAction(themeSessionResolver);
