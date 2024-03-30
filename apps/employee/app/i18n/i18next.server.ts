import { resolve } from 'node:path';
import Backend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next/server';

import { i18Config } from './i18next.config'; // your i18n configuration file

const i18nextConfig = new RemixI18Next({
  detection: {
    supportedLanguages: i18Config.supportedLanguages,
    fallbackLanguage: i18Config.fallbackLanguage,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18Config,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  plugins: [Backend],
});

export default i18nextConfig;
