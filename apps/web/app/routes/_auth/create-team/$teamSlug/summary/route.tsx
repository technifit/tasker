import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { $params } from 'remix-routes';

import { Button, CardFooter, CardHeader, CardTitle } from '@technifit/ui';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';
import { getStep } from '../../config';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);
  const { teamSlug } = $params('/create-team/:teamSlug/summary', args.params);

  return { teamSlug, url: args.request.url };
};

export const CreateOrganizationSummary = () => {
  const { teamSlug, url } = useLoaderData<typeof loader>();

  return (
    <>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link to={getStep({ direction: 'next', url, params: { teamSlug } })}>Get Started</Link>
        </Button>
      </CardFooter>
    </>
  );
};

export default CreateOrganizationSummary;
