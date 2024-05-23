import type { LoaderFunctionArgs } from '@remix-run/node';

export function loader({ params }: LoaderFunctionArgs) {
  return new Response('Healthy', {
    status: 200,
  });
}
