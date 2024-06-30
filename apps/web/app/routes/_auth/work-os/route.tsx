import { serverOnly$ } from 'vite-env-only/macros';

import { newId } from '@technifit/id/new-id';
import { withAuthentication } from '@technifit/middleware/authenticated';

export const middleware = serverOnly$([withAuthentication]);

export const loader = () => {
  return {
    id: newId('session'),
  };
};

export const Index = () => {
  return <div>This route should only be accessible if the user is authenticated.</div>;
};

export default Index;
