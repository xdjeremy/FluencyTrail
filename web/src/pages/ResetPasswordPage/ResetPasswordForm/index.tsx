import { FC, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms';
import { Link, navigate, routes } from '@redwoodjs/router';

import { useAuth } from 'src/auth';
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

import { ResetConfirmPasswordField, ResetPasswordField } from './PasswordField';
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from './ResetPasswordSchema';

interface ResetPasswordFormProps {
  resetToken?: string;
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ resetToken }) => {
  const { reauthenticate, resetPassword } = useAuth();
  const [resetState, setResetState] = useState<'idle' | 'success'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle countdown and redirect after successful reset
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (resetState === 'success') {
      timer = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            navigate(routes.login());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resetState]);

  // Handle reset password
  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = async data => {
    setIsLoading(true);
    const response = await resetPassword({
      resetToken,
      password: data.password,
    });

    if (response.error) {
      setErrorMessage(response.error);
      setIsLoading(false);
    } else {
      setResetState('success');
      await reauthenticate();
    }
  };

  // Double safety incase we did not catch this in the parent component
  if (!resetToken) return null;
  return (
    <Card className="mx-auto mt-20 w-full max-w-md shadow-sm">
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
          Create a new password for your account. Make sure it is strong and
          secure.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {resetState === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <ShieldCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <Message variant="success" icon="success">
              Your password has been successfully reset. You can now log in with
              your new password.
            </Message>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Redirecting to login page in{' '}
              <span className="font-medium">{redirectCountdown}</span>{' '}
              seconds...
            </p>
          </div>
        )}

        {resetState === 'idle' && (
          <Form formMethods={form} onSubmit={onSubmit} className="space-y-4">
            {errorMessage && (
              <Message
                textClassName="text-xs"
                variant="destructive"
                icon="destructive"
              >
                {errorMessage}
              </Message>
            )}

            <ResetPasswordField isLoading={isLoading} />
            <ResetConfirmPasswordField isLoading={isLoading} />

            <Message textClassName="text-xs">
              Your password must be at least 8 characters long and include
              uppercase and lowercase letters, a number, and a special character
              for maximum security.
            </Message>

            <Button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 h-11 w-full text-white dark:text-neutral-900"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        {resetState === 'success' ? (
          <Button
            className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 w-full text-white dark:text-neutral-900"
            asChild
          >
            <Link to={routes.login()}>Go to Login</Link>
          </Button>
        ) : (
          <div className="text-center text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Remember your password?
            </span>{' '}
            <Link
              to={routes.login()}
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              Log in
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
