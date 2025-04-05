import { FC } from 'react';

import { AlertCircle } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert';
import { Button } from 'src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

interface ConfirmEmailErrorProps {
  errorMessage: string;
}

const ConfirmEmailError: FC<ConfirmEmailErrorProps> = ({ errorMessage }) => {
  return (
    <Card className="mx-auto mt-20 w-full max-w-md border-neutral-200 shadow-sm dark:border-neutral-800">
      <CardHeader className="space-y-1 pb-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Something Went Wrong
        </CardTitle>
        <CardDescription className="text-center text-base">
          We encountered an error while trying to confirm your email
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription>
            {errorMessage ||
              'An unexpected error occurred during the email confirmation process.'}
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Button
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 w-full text-white dark:text-neutral-900"
          asChild
        >
          <Link to={routes.signup()}>Return to Sign Up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmEmailError;
