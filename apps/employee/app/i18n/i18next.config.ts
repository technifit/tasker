import { namespaces, supportedLanguages } from './resources';

const i18Config = {
  fallbackLanguage: 'en',
  supportedLanguages: supportedLanguages,
  defaultNS: namespaces,
  react: { useSuspense: false },
};

export { i18Config };
