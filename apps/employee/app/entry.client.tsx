import { startTransition, StrictMode } from 'react';
import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import initializeClientI18n from './i18n/initialise-client-i18n';

startTransition(() => {
  void initializeClientI18n().then((i18next) => {
    const App = (
      <StrictMode>
        <I18nextProvider i18n={i18next}>
          <RemixBrowser />
        </I18nextProvider>
      </StrictMode>
    );

    hydrateRoot(document, App);
  });
});
