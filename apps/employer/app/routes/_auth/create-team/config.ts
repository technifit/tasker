import { useEffect } from 'react';
import { useLocation, useParams } from '@remix-run/react';
import type { Params } from '@remix-run/react';
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

interface StepProgress {
  totalSteps: number;
  activeStep: number;
  isLastStep: boolean;
}

/**
 * Retrieves the next or previous step based on the given direction and URL parameters.
 * @param direction - The direction of the step ('next' or 'previous').
 * @param url - The URL string.
 * @param params - The URL parameters.
 * @returns The path of the next or previous step.
 */
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

/**
 * Retrieves the step progress information based on the current pathname and parameters.
 * @param pathname - The current pathname.
 * @param params - The parameters used to generate the step paths.
 * @returns The step progress information.
 */
export const getStepProgress = (pathname: string, params: Params<string>): StepProgress => {
  const currentStep = steps.find((step) => $path(step.path, params).includes(pathname));

  const currentStepIndex = currentStep ? steps.findIndex((step) => step.path.match(currentStep.path)) + 1 : undefined;

  return {
    totalSteps: steps.length,
    activeStep: currentStepIndex ?? 1,
    isLastStep: currentStepIndex === steps.length,
  };
};

/**
 * Custom hook that returns the step progress based on the current location and parameters.
 * @returns The step progress.
 */
export const useGetStepProgress = () => {
  const { pathname } = useLocation();
  const params = useParams();

  let stepProgress = getStepProgress(pathname, params);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stepProgress = getStepProgress(pathname, params);
  }, [params, stepProgress, pathname]);

  return stepProgress;
};
