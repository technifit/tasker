import { createThemeAction } from 'remix-themes';

import { themeSessionResolver } from './theme.server';

export const THEME_ROUTE_PATH = '/resources/theme';

export const action = createThemeAction(themeSessionResolver);
