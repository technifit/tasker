import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { $params } from 'remix-routes';

import { Button } from '@technifit/ui/button';
import { CardFooter, CardHeader, CardTitle } from '@technifit/ui/card';

import { getStep } from '../../config';

export const loader = (args: LoaderFunctionArgs) => {
  const { organisationSlug } = $params('/create-organisation/:organisationSlug/summary', args.params);

  return { organisationSlug, url: args.request.url };
};

export const CreateOrganizationSummary = () => {
  const { organisationSlug, url } = useLoaderData<typeof loader>();

  return (
    <>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link to={getStep({ direction: 'next', url, params: { organisationSlug } })}>Get Started</Link>
        </Button>
      </CardFooter>
    </>
  );
};

export default CreateOrganizationSummary;
