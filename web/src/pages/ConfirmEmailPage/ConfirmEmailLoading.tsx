import { Loader2, MailCheck } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

const ConfirmEmailLoading = () => {
  return (
    <Card className="mx-auto mt-20 w-full max-w-md shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <div className="mb-4 flex justify-center">
          <div
            className="relative flex h-20 w-20 items-center justify-center"
            aria-hidden="true"
          >
            <div className="border-brand-200 dark:border-brand-800 absolute inset-0 rounded-full border-4"></div>
            <div className="border-t-brand-600 dark:border-t-brand-400 absolute inset-0 animate-spin rounded-full border-4 border-transparent"></div>
            <MailCheck className="text-brand-600 dark:text-brand-400 h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Initializing...
        </CardTitle>
        <CardDescription className="text-center text-base">
          Preparing to verify your email address
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="text-brand-600 dark:text-brand-400 h-5 w-5 animate-spin" />
            <span className="text-neutral-600 dark:text-neutral-400">
              Loading verification details
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmEmailLoading;
