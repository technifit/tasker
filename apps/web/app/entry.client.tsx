import { startTransition, StrictMode } from 'react';
import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  const App = (
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );

  hydrateRoot(document, App);
});
