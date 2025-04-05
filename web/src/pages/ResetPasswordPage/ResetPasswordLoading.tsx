import { Loader2, Lock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

const ResetPasswordLoading = () => {
  return (
    <Card className="mx-auto mt-20 w-full max-w-md border-neutral-200 shadow-sm dark:border-neutral-800">
      <CardHeader className="space-y-1 pb-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-16 w-16 items-center justify-center rounded-full">
            <Lock className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-center">
          Loading your password reset page...
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="text-brand-600 dark:text-brand-400 mb-4 h-8 w-8 animate-spin" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Please wait while we load your reset page
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordLoading;
