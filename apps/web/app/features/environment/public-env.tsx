import type { PublicEnv } from '@technifit/environment/types';

declare global {
  interface Window {
    ENV: PublicEnv;
  }
}

const PublicEnvironment = ({ publicEnvs }: { publicEnvs: PublicEnv }) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(publicEnvs)}`,
      }}
    />
  );
};

const getPublicEnv = <T extends keyof PublicEnv>(key: T): PublicEnv[T] => {
  if (typeof window !== 'undefined' && !window.ENV) {
    throw new Error(`Missing the <PublicEnv /> component at the root of your app.`);
  }

  if (typeof window === 'undefined') {
    throw new Error(`The window object is not available in the current environment.`);
  }

  return window.ENV[key];
};

export { getPublicEnv, PublicEnvironment };
