import { useEffect, useState } from 'react';

import { CheckCircle2 } from 'lucide-react';

import { Link, navigate, routes } from '@redwoodjs/router';

import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert';
import { Button } from 'src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

const ConfirmEmailSuccess = () => {
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // TODO: Implement a countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          navigate(routes.login());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);
  return (
    <Card className="mx-auto mt-20 w-full max-w-md border-neutral-200 shadow-sm dark:border-neutral-800">
      <CardHeader className="space-y-1 pb-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Email Confirmed!
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Verification Successful</AlertTitle>
            <AlertDescription>
              Your email has been successfully verified. You now have full
              access to your account.
            </AlertDescription>
          </Alert>
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            Redirecting to login page in{' '}
            <span className="font-medium">{redirectCountdown}</span> seconds...
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Button
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 w-full text-white dark:text-neutral-900"
          asChild
        >
          <Link to={routes.login()}>Go to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmEmailSuccess;
