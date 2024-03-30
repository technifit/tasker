import { translateColorFromHexToHsl } from '../color-translator/translate-color-from-hex-to-hsl';

const extractThemVariablesFromRequest = (url: string) => {
  const searchParams = new URL(url).searchParams;

  const theme: Record<string, string> = {};

  for (const key of searchParams.keys()) {
    if (key.startsWith('theme_')) {
      const value = searchParams.get(key);
      if (value) {
        if (key.includes('Color')) {
          theme[key.replace('theme_', '')] = translateColorFromHexToHsl(value);
        } else {
          theme[key.replace('theme_', '')] = value;
        }
      }
    }
  }

  return theme;
};

export { extractThemVariablesFromRequest };
