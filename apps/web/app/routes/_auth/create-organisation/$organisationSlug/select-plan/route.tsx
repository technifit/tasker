import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { $params } from 'remix-routes';

import { Button } from '@technifit/ui/button';
import { CardFooter, CardHeader, CardTitle } from '@technifit/ui/card';

import { getStep } from '../../config';

export const loader = (args: LoaderFunctionArgs) => {
  const { organisationSlug } = $params('/create-organisation/:organisationSlug/select-plan', args.params);

  return { organisationSlug, url: args.request.url };
};

export const SelectOrganizationPlan = () => {
  const { organisationSlug, url } = useLoaderData<typeof loader>();

  return (
    <>
      <CardHeader>
        <CardTitle>Select Plan</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link to={getStep({ direction: 'next', url, params: { organisationSlug } })}>Continue</Link>
        </Button>
      </CardFooter>
    </>
  );
};

export default SelectOrganizationPlan;
