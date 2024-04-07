import { $path } from 'remix-routes';
import type { Routes } from 'remix-routes';

export const steps: { path: keyof Routes }[] = [
  { path: '/create-team' },
  { path: '/create-team/:teamSlug/add-members' },
  { path: '/create-team/:teamSlug/select-plan' },
  { path: '/create-team/:teamSlug/summary' },
];

interface GetStepProps {
  direction: 'next' | 'previous';
  url: string;
  params: {
    teamSlug: string;
  };
}

export const getStep = ({ direction, url, params }: GetStepProps) => {
  const { pathname, searchParams } = new URL(url);

  // Get current step based on the URL
  const currentIndex = steps.findIndex((step) => $path(step.path, params).includes(pathname));

  // Get next or previous step based on the current step
  const step = steps[currentIndex + (direction === 'next' ? 1 : -1)];

  // If the direction is `next` and it's the last step
  if (direction === 'next' && !step) return $path('/');

  if (!step) return $path('/');

  return $path(step.path, { ...params, ...Object.fromEntries(searchParams) });
};
