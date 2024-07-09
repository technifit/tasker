import { createThemeAction } from 'remix-themes';

import { themeSessionResolver } from '@technifit/theme/theme-switcher';

export const action = createThemeAction(themeSessionResolver);
