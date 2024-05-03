import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { $params } from 'remix-routes';

import { Button } from '@technifit/ui/button';
import { CardFooter, CardHeader, CardTitle } from '@technifit/ui/card';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';
import { getStep } from '../../config';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);
  const { teamSlug } = $params('/create-team/:teamSlug/add-members', args.params);

  return { teamSlug, url: args.request.url };
};

export const AddOrganizationMembers = () => {
  const { teamSlug, url } = useLoaderData<typeof loader>();

  return (
    <>
      <CardHeader>
        <CardTitle>Add Members</CardTitle>
        <CardFooter>
          <Button asChild>
            <Link to={getStep({ direction: 'next', url, params: { teamSlug } })}>Continue</Link>
          </Button>
        </CardFooter>
      </CardHeader>
    </>
  );
};

export default AddOrganizationMembers;
