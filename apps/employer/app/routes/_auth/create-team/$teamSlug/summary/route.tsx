import type { LoaderFunctionArgs } from '@vercel/remix';

import { CardHeader, CardTitle } from '@technifit/ui';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const CreateOrganizationSummary = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
    </>
  );
};

export default CreateOrganizationSummary;
