import { useClerk, useOrganizationList } from '@clerk/remix';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { z } from 'zod';

import {
  Balancer,
  Button,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CircleHelp,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
  useForm,
} from '@technifit/ui';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';
import { getStep } from '../config';

export const createTeamFormSchema = z.object({
  teamName: z.string({ required_error: 'Please enter your team name' }).min(1),
});

export type CreateTeamFormData = z.infer<typeof createTeamFormSchema>;

export const resolver = zodResolver(createTeamFormSchema);

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker | Create Team' }, { name: 'description', content: 'Create Team' }];
};
export const CreateOrganization = () => {
  const { createOrganization } = useClerk();
  const { setActive } = useOrganizationList();
  const navigate = useNavigate();

  const form = useForm<CreateTeamFormData>({
    resolver,
    submitHandlers: {
      onValid: async ({ teamName }) => {
        const { id, slug } = await createOrganization({ name: teamName });

        if (!setActive) {
          throw new Error('Organization not set');
        }

        await setActive({ organization: id });

        navigate(getStep({ direction: 'next', url: window.location.href, params: { teamSlug: slug! } }));
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit}>
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
