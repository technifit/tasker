import type { AppContext } from '@technifit/environment/types';

/**
 * Declare our loaders and actions context type
 */
declare module '@remix-run/node' {
  /**
   * Represents the context for loading the app.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AppLoadContext extends AppContext {}
}
