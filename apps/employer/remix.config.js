const { flatRoutes } = require('remix-flat-routes');
process.env.NODE_ENV === 'development' && require('dotenv').config({ path: '../../.env' });

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  tailwind: true,
  serverModuleFormat: 'cjs',
  future: {
    v3_fetcherPersist: true,
  },
  serverDependenciesToBundle: ['nanoid/non-secure'],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes, {
      ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}', '**/__*.*'],
    });
  },
};
