import { Suspense } from 'react';
import { defer, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Await, Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { $path } from 'remix-routes';

import { Button, Card, CardContent, CardHeader, Input, Label, Typography } from '@technifit/ui';

import i18nextConfig from '~/i18n/i18next.server';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { appVersion } = context;

  const t = await i18nextConfig.getFixedT(request);
  const title = t('common:landing.meta.title');
  const description = t('common:landing.meta.description');

  const message = 'Hello World from Remix Vite loader';
  console.log(message, appVersion);
  return defer({
    meta: {
      title,
      description,
    },
    message,
    appVersion,
    lastNews: (async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return [
        { id: 1, title: 'A list' },
        { id: 2, title: 'that takes' },
        { id: 3, title: 'a couple of seconds' },
      ];
    })(),
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(request, unstable_createMemoryUploadHandler());
  console.log('file', formData.get('file'));

  return json({ fileName: (formData.get('file') as File).name });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? data.meta.title : 'Welcome to Remix!' },
  { name: 'description', content: data ? data.meta.description : 'Welcome to Remix!' },
];

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation();

  return (
    <div className='container flex flex-col gap-2 py-6'>
      <Typography variant={'h1'}>{t('common:landing.header.title')}</Typography>
      <div className='flex gap-2'>
        <Typography variant={'link'} asChild>
          <Link to={$path('/')} prefetch='intent'>
            Link to Home
          </Link>
        </Typography>
        <Typography variant={'link'} asChild>
          <Link to={$path('/health/employer')} prefetch='intent'>
            Link to Employer
          </Link>
        </Typography>
        <Typography variant={'link'} asChild>
          <Link to={$path('/health/employee')} prefetch='intent'>
            Link to Employee
          </Link>
        </Typography>
      </div>
      <Card>
        <CardHeader>
          <Typography variant={'h2'}>{t('common:landing.header.description')}</Typography>
        </CardHeader>

        <CardContent className='flex flex-col gap-3'>
          <Card>
            <CardHeader>
              <Typography variant={'h4'}>Loader</Typography>
            </CardHeader>
            <CardContent>
              <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                {JSON.stringify(loaderData, null, 2)}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Typography variant={'h4'}>Deferred loader</Typography>
            </CardHeader>
            <CardContent>
              <LastNews />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Typography variant={'h4'}>HMR</Typography>{' '}
            </CardHeader>
            <CardContent>
              <Label className='flex flex-row gap-1'>
                Should persist state across HMR
                <Input type='text' placeholder='HMR test' className='ml-2' />
              </Label>
              <Typography variant={'p'}>
                This input should persist its value across HMR
                <br />
                Try to change the file and see if the value is still here
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Typography variant={'h4'}>Action</Typography>
            </CardHeader>
            <CardContent className='flex flex-col gap-1'>
              <Form
                encType='multipart/form-data'
                method='POST'
                className='flex w-fit flex-col gap-1 rounded-md border p-4 '
              >
                <Label className='text-white'>
                  Upload a file
                  <Input type='file' accept='image/*' name='file' className='cursor-pointer' />
                </Label>
                <Button type='submit' variant={'default'}>
                  Submit
                </Button>
              </Form>
              {actionData ? (
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                  {JSON.stringify(actionData, null, 2)}
                </code>
              ) : null}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <Button variant={'secondary'} onClick={() => location.reload()}>
        Reload the page
      </Button>
    </div>
  );
}

export function LastNews() {
  const { lastNews } = useLoaderData<typeof loader>();

  return (
    <Suspense
      fallback={
        <ul className='animate-pulse'>
          <li>Loading ...</li>
          <li>...</li>
          <li>...</li>
        </ul>
      }
    >
      <Await resolve={lastNews}>
        {(lastNews) => (
          <ul>
            {lastNews.map((news) => (
              <li key={news.id}>{news.title}</li>
            ))}
          </ul>
        )}
      </Await>
    </Suspense>
  );
}
