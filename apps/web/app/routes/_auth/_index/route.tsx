import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { $path } from 'remix-routes';

import { requireAuthenticatedOrgUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const orgUser = await requireAuthenticatedOrgUser(args);

  if (orgUser.orgSlug) {
    return redirect($path('/:organisationSlug', { organisationSlug: orgUser.orgSlug }));
  }

  return redirect($path('/create-organisation'));
};

export const Index = () => {
  return (
    <div>
      This route should just check for the presence of an org or not. If the user has an org, redirect them to
      $organization-slug. If not, redirect them to create-org
    </div>
  );
};

export default Index;
