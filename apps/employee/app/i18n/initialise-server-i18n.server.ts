import { resolve } from 'node:path';
import type { EntryContext } from '@remix-run/node';
import { createInstance } from 'i18next';
import type { i18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import { initReactI18next } from 'react-i18next';

import { i18Config } from './i18next.config';
import i18next from './i18next.server';

async function initializeServerI18n(request: Request, context: EntryContext): Promise<i18n> {
  const instance = createInstance();
  const lng = await i18next.getLocale(request);
  const ns = [...i18Config.defaultNS, ...i18next.getRouteNamespaces(context)];

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      ...i18Config, // spread the configuration
      supportedLngs: i18Config.supportedLanguages,
      fallbackLng: i18Config.fallbackLanguage,
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: { loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json') },
    });

  return instance;
}

export default initializeServerI18n;
