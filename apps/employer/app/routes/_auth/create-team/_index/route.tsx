import { createClerkClient } from '@clerk/remix/api.server';
import { zodResolver } from '@hookform/resolvers/zod';
import { json, redirect } from '@vercel/remix';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { getValidatedFormData } from 'remix-hook-form';
import { $path } from 'remix-routes';
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

import { environment } from '~/lib/environment/environment';
import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const createTeamFormSchema = z.object({
  teamName: z.string({ required_error: 'Please enter your team name' }).min(1),
});

export type CreateTeamFormData = z.infer<typeof createTeamFormSchema>;

export const resolver = zodResolver(createTeamFormSchema);

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};

export const action = async (args: ActionFunctionArgs) => {
  const { request } = args;

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<CreateTeamFormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValue" are picked up automatically by useRemixForm
    return json({ errors, defaultValues });
  }

  const { userId } = await requireAuthenticatedUser(args);

  const response = await createClerkClient({
    secretKey: environment().CLERK_SECRET_KEY,
  }).organizations.createOrganization({
    name: data.teamName,
    createdBy: userId,
  });

  return redirect($path('/create-team/:teamSlug/add-members', { teamSlug: response.slug! }));
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
                  <Input autoFocus placeholder='my awesome team' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button disabled={form.formState.isSubmitting} className='w-full'>
            {form.formState.isSubmitting ? 'Creating Team...' : 'Continue'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default CreateOrganization;
