import type { LoaderFunctionArgs } from '@vercel/remix';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const SelectOrganizationPlan = () => {
  return <div className='w-full grow'>Select Plan</div>;
};

export default SelectOrganizationPlan;
