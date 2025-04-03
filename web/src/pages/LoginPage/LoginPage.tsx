import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Book, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms';
import { Link, navigate, routes } from '@redwoodjs/router';
import { Metadata } from '@redwoodjs/web';

import { useAuth } from 'src/auth';
import { Button } from 'src/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';

import { LoginSchema, LoginSchemaType } from './LoginSchema';

const LoginPage = () => {
  const { isAuthenticated, logIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit: SubmitHandler<LoginSchemaType> = async data => {
    setIsLoading(true);
    const response = await logIn({
      username: data.email,
      password: data.password,
    });

    if (response.message) {
      toast(response.message);
    } else if (response.error) {
      toast.error(response.error);
    } else {
      toast.success('Welcome back!');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Metadata title="Login" />
      <div className={isLoading ? 'pointer-events-none' : ''}>
        <Form
          formMethods={form}
          onSubmit={onSubmit}
          error={form.formState.errors}
        >
          <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 md:px-0">
            <div className="mb-6 flex justify-center">
              <Book className="h-12 w-12" />
            </div>

            <h1 className="mb-1 text-center text-2xl font-semibold">
              Log in to your account
            </h1>
            <p className="mb-8 text-center">
              Or{' '}
              <Link
                to={routes.signup()}
                className="text-brand-600 hover:text-brand-800"
                aria-disabled={isLoading}
                onClick={e => isLoading && e.preventDefault()}
              >
                create a new one for free
              </Link>
            </p>

            <div className="w-full space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        disabled={isLoading}
                        {...field}
                        aria-disabled={isLoading}
                        ref={emailRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        {...field}
                        aria-disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end">
                <Link
                  to={routes.forgotPassword()}
                  className="text-brand-600 hover:text-brand-800 text-sm"
                  aria-disabled={isLoading}
                  onClick={e => isLoading && e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant={'brand'}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2
                    data-testid="loader-icon"
                    className="mr-2 h-5 w-5 animate-spin"
                  />
                )}
                Log in
              </Button>
            </div>

            <div className="mt-8 w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-neutral-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size={'lg'}
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size={'lg'}
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <svg
                    className="h-5 w-5 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size={'lg'}
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
