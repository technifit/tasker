import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next/client';

import { i18Config } from './i18next.config';

function initializeClientI18n() {
  return i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(LanguageDetector) // Setup a client-side language detector
    .use(Backend) // Setup your backend
    .init({
      ...i18Config, // spread the configuration
      fallbackLng: i18Config.fallbackLanguage,
      supportedLngs: i18Config.supportedLanguages,
      // This function detects the namespaces your routes rendered while SSR use
      ns: [...i18Config.defaultNS, ...getInitialNamespaces()],
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ['htmlTag'],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    })
    .then(() => i18next);
}

export default initializeClientI18n;
