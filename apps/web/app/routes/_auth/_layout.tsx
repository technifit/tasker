import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { serverOnly$ } from 'vite-env-only/macros';

import { getOrganisation, listOrgnisationMemberships } from '@technifit/authentication/organisation';
import { withAuthentication } from '@technifit/middleware/authenticated';
import { SessionContext } from '@technifit/middleware/session';
import { SidebarProvider } from '@technifit/ui/sidebar';

export const middleware = serverOnly$([withAuthentication]);

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const sessionContext = context.get(SessionContext);
  const user = sessionContext.get('user');

  if (!user) {
    throw new Error('No user found');
  }

  const organisationMembershipResponse = await listOrgnisationMemberships({ userId: user.id });
  const organisation = organisationMembershipResponse.data.length
    ? await getOrganisation(organisationMembershipResponse.data[0]!.organizationId)
    : null;
  return {
    user,
    organisation,
    role: organisationMembershipResponse.data.length ? organisationMembershipResponse.data[0]!.role.slug : null,
  };
};
const AppLayout = () => {
  return (
    <>
      <SidebarProvider>
        <Outlet />
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
