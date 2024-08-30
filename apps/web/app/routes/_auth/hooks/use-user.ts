import { useRouteLoaderData } from '@remix-run/react';
import { $routeId } from 'remix-routes';

import type { loader } from '../_layout';

const useUser = () => {
  const data = useRouteLoaderData<typeof loader>($routeId('routes/_auth/_layout'));

  if (data === undefined) {
    throw new Error('useUser must be used within the _auth/_layout route or its children');
  }

  return {
    ...data.user,
    fullName: `${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`,
  };
};

export { useUser };
