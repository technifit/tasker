import type { LoaderFunctionArgs } from '@vercel/remix';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const AddOrganizationMembers = () => {
  return <div className='w-full grow'>Add Members</div>;
};

export default AddOrganizationMembers;
