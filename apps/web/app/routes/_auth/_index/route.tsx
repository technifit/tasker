import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { $path } from 'remix-routes';

import { listOrgnisationMemberships } from '@technifit/authentication/organisation';
import { SessionContext } from '@technifit/middleware/session';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const sessionContext = context.get(SessionContext);
  const user = sessionContext.get('user');

  if (!user) {
    throw redirect($path('/log-in'));
  }

  const memberships = await listOrgnisationMemberships({ userId: user.id });

  if (memberships.data.length) {
    return redirect($path('/:organisationSlug', { organisationSlug: memberships.data[0]!.organizationId }));
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
