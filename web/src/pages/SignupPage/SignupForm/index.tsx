import { Book, Loader2 } from 'lucide-react';

import { Form, UseFormReturn } from '@redwoodjs/forms';
import { Link, routes } from '@redwoodjs/router';

import { Alert, AlertDescription } from 'src/components/ui/alert';
import { Button } from 'src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

import OAuthSignup from './OAuthSignup';
import {
  SignupConfirmPasswordField,
  SignupEmailField,
  SignupNameField,
  SignupPasswordField,
  SignupTermsField,
  SignupTimezoneField,
} from './SignupFields';
import { SignupSchemaType } from './SignupSchema'; // Import the new component

interface SignupFormProps {
  onSubmit?: (data: SignupSchemaType) => void;
  isLoading?: boolean;
  isSuccess: boolean;
  serverError?: string;
  form: UseFormReturn<SignupSchemaType>;
}

const SignupForm = ({
  onSubmit,
  isLoading,
  isSuccess,
  serverError,
  form,
}: SignupFormProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-12 w-12 items-center justify-center rounded-full">
            <Book className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription className="text-center">
          Join thousands of language learners and start your journey today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form formMethods={form} className="space-y-4" onSubmit={onSubmit}>
          {isSuccess && (
            <Alert className="border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
              <AlertDescription className="text-xs text-neutral-600 dark:text-neutral-400">
                Please check your inbox and click the verification link to
                complete your registration. If you don&apos;t see it, check your
                spam folder.
              </AlertDescription>
            </Alert>
          )}
          {serverError && (
            <Alert className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/50 dark:text-red-400">
              <AlertDescription className="text-xs">
                {serverError}
              </AlertDescription>
            </Alert>
          )}
          <SignupNameField isLoading={isLoading} />
          <SignupEmailField isLoading={isLoading} />
          <SignupTimezoneField isLoading={isLoading} />
          <SignupPasswordField isLoading={isLoading} />
          <SignupConfirmPasswordField isLoading={isLoading} />
          {/* Add the timezone field */}
          <SignupTermsField isLoading={isLoading} />
          <Button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 h-11 w-full text-white dark:text-neutral-900"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </Form>
        <OAuthSignup isLoading={isLoading} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="text-center text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Already have an account?
          </span>{' '}
          <Link
            to={routes.login()}
            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Log in
          </Link>
        </div>
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
