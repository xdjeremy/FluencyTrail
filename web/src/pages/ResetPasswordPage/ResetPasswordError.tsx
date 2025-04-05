import { Lock } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import Message from 'src/components/Forms/Message';
import { Button } from 'src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

const ResetPasswordError = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <Card className="mx-auto mt-20 w-full max-w-md shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            <Lock className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Something Went Wrong
        </CardTitle>
        <CardDescription className="text-center">
          We encountered an error while loading your password reset page
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Message variant="destructive" icon="destructive">
          {errorMessage ||
            'An unexpected error occurred during the password reset process.'}
        </Message>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <Button
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 w-full text-white dark:text-neutral-900"
          asChild
        >
          <Link to={routes.forgotPassword()}>Request New Reset Link</Link>
        </Button>

        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            Need help?{' '}
            <Link
              to="/contact"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Contact support
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordError;
