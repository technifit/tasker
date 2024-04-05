import type { LoaderFunctionArgs } from '@vercel/remix';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const CreateOrganizationSummary = () => {
  return <div className='w-full grow'>Summary</div>;
};

export default CreateOrganizationSummary;
