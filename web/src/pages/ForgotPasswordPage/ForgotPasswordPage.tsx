import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms';
import { Link, navigate, routes } from '@redwoodjs/router';
import { Metadata } from '@redwoodjs/web';

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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';

import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from './ForgotPasswordSchema';

const ForgotPasswordPage = () => {
  const { isAuthenticated, forgotPassword } = useAuth();
  const [requestState, setRequestState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [userEmail, setUserEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef?.current?.focus();
  }, []);

  const onSubmit: SubmitHandler<ForgotPasswordSchemaType> = async data => {
    setRequestState('loading');

    const response = await forgotPassword(data.email);

    if (response.error) {
      setRequestState('error');
      setErrorMessage(response.error);
    } else {
      // The function `forgotPassword.handler` in api/src/functions/auth.js has
      // been invoked, let the user know how to get the link to reset their
      // password (sent in email, perhaps?)
      setRequestState('success');
      setUserEmail(data.email);
    }
  };

  return (
    <>
      <Metadata title="Forgot Password" />

      <Card className="mx-auto mt-20 max-w-md">
        <CardHeader className="space-y-1 pb-6">
          <div className="mb-4 flex justify-center">
            <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-16 w-16 items-center justify-center rounded-full">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {requestState === 'success' && (
            <Message variant="success" icon="success">
              We&apos;ve sent a password reset link to{' '}
              <strong>{userEmail}</strong>. Please check your inbox and follow
              the instructions to reset your password.
            </Message>
          )}

          {requestState === 'error' && (
            <Message variant="destructive" icon="destructive">
              {errorMessage}
            </Message>
          )}

          {requestState !== 'success' && (
            <Form formMethods={form} onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="h-11"
                        disabled={requestState === 'loading'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 h-11 w-full text-white dark:text-neutral-900"
                disabled={requestState === 'loading'}
              >
                {requestState === 'loading' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Reset Link
              </Button>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
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
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            If you continue to experience issues, please contact our support
            team.
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default ForgotPasswordPage;
