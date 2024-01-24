import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@technifit/ui';

export type ErrorAlertProps = {
  heading: React.ReactNode;
  description: React.ReactNode;
};

export function ErrorAlert({ heading, description }: ErrorAlertProps) {
  return (
    <Alert className='animate-in fade-in' variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>{heading}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
