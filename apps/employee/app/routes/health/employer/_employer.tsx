import { useEffect } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { $path } from 'remix-routes';

import { emitInternalEvent } from '@technifit/events';
import { Button, Card, CardContent, CardHeader, Input, Label, Typography } from '@technifit/ui';

export const meta: MetaFunction = () => [{ title: 'Employer' }, { name: 'description', content: 'Welcome to Remix!' }];

export function loader({ context }: LoaderFunctionArgs) {
  const { appVersion } = context;
  return { appVersion };
}

export default function Index() {
  const { t } = useTranslation();

  // FIXME: This is temporary for demo purposes
  useEffect(
    () =>
      emitInternalEvent({
        type: 'embed:page-change',
        payload: {
          url: window.location.href,
        },
      }),
    [],
  );

  return (
    <div className='container flex flex-col gap-2 py-6'>
      <Typography variant={'h1'}>{t('common:employer.header.title')}</Typography>

      <Card>
        <CardHeader>
          <Typography variant={'h2'}>{t('common:landing.header.description')}</Typography>
        </CardHeader>
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
        <CardContent className='flex flex-col gap-3'>
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
