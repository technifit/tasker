import type { Theme } from '../theme';

/**
 * Sets the theme by updating the URL search parameters with the provided theme object.
 * @param theme - The theme object containing key-value pairs for the theme properties.
 * @param url - The URL object to update with the theme parameters.
 * @param debug - Optional. If true, debug information will be logged to the console.
 */
export const setThemeSearchParams = (theme: Partial<Theme>, url: URL, debug = false) => {
  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === 'string' && value.length > 0) {
      url.searchParams.set(`theme_${key}`, value);
      debug && console.log(`setting ${key} colour:`, value);
    }

    if (debug && key === Object.keys(theme)[Object.keys(theme).length - 1]) {
      console.log('URL with theme parameters:', url.toString());
    }
  }
};
