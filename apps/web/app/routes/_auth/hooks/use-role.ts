import { useRouteLoaderData } from '@remix-run/react';
import { $routeId } from 'remix-routes';

import type { loader } from '../_layout';

const useRole = () => {
  const data = useRouteLoaderData<typeof loader>($routeId('routes/_auth/_layout'));

  if (data === undefined) {
    throw new Error('useRole must be used within the _auth/_layout route or its children');
  }

  // TODO: strongly type role -- https://linear.app/technifit/issue/TASK-119/strongly-type-role
  return data.role ? ('admin' as const) : null;
};

export { useRole };
