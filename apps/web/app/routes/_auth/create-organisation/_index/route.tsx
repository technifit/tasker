import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { z } from 'zod';

import { createOrganisation, createOrgnisationMembership } from '@technifit/authentication/organisation';
import { SessionContext } from '@technifit/middleware/session';
import { Balancer } from '@technifit/ui/balancer';
import { Button } from '@technifit/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@technifit/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  getValidatedFormData,
  useForm,
} from '@technifit/ui/form';
import { CircleHelp } from '@technifit/ui/icons';
import { Input } from '@technifit/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@technifit/ui/tooltip';
import { Typography } from '@technifit/ui/typography';

import { getStep } from '../config';

export const createTeamFormSchema = z.object({
  teamName: z.string({ required_error: 'Please enter your team name' }).min(1),
});

export type CreateTeamFormData = z.infer<typeof createTeamFormSchema>;

export const resolver = zodResolver(createTeamFormSchema);

export const loader = () => {
  return null;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<CreateTeamFormData>(request, resolver);

  if (errors) {
    return { errors, defaultValues };
  }
  const sessionContext = context.get(SessionContext);
  const user = sessionContext.get('user');

  const createOrganisationResponse = await createOrganisation({ name: data.teamName });
  const organisationMembership = await createOrgnisationMembership({
    organizationId: createOrganisationResponse.id,
    userId: user!.id,
    roleSlug: 'admin',
  });

  return redirect(
    getStep({
      direction: 'next',
      url: request.url,
      params: { organisationSlug: organisationMembership.organizationId },
    }),
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Create Team' }, { name: 'description', content: 'Create Team' }];
};
export const CreateOrganization = () => {
  const form = useForm<CreateTeamFormData>({
    resolver,
  });

  return (
    <Form {...form}>
      <form method='POST' onSubmit={form.handleSubmit}>
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name='teamName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex flex-row items-center gap-1'>
                  Team Name
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className='size-4 cursor-pointer' />
                      </TooltipTrigger>
                      <TooltipContent className='max-w-xs'>
                        <Balancer>
                          <Typography className='font-normal'>
                            This name will be displayed to team members, collaborators, and on all public facing
                            correspondance from tasker
                          </Typography>
                        </Balancer>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input placeholder='my awesome team' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating Team...' : 'Continue'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default CreateOrganization;
