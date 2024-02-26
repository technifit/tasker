import { ScreenSizeIndicator } from '@technifit/ui';

import { getPublicEnv } from './public-env';

export function TailwindIndicator() {
  if (getPublicEnv('NODE_ENV') === 'production' || getPublicEnv('VERCEL_ENV') === 'production') return null;

  return <ScreenSizeIndicator />;
}
