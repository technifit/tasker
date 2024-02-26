const { flatRoutes } = require('remix-flat-routes');
process.env.NODE_ENV === 'development' && require('dotenv').config({ path: '../../.env' });

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  tailwind: true,
  serverModuleFormat: 'cjs',
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPaths: true,
  },
  serverDependenciesToBundle: ['nanoid', /^@vercel\/analytics/, /^remix-utils.*/, /^@technifit\/ui$/, /^@technifit\/email$/],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes, {
      ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}', '**/__*.*'],
    });
  },
  watchPaths: ['../../packages/ui/src/**/*'],
};
