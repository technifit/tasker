import { createClerkClient } from '@clerk/remix/api.server';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@vercel/remix';

import { environment } from '~/lib/environment/environment';
import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const action = async (args: ActionFunctionArgs) => {
  const auth = await requireAuthenticatedUser(args);

  const createdOrg = await createClerkClient({
    secretKey: environment().CLERK_SECRET_KEY,
  }).organizations.createOrganization({
    name: 'My Organization',
    createdBy: auth.userId,
  });

  return null;
};

export const CreateOrganization = () => {
  return <div className='w-full grow'>Create Organization</div>;
};

export default CreateOrganization;
