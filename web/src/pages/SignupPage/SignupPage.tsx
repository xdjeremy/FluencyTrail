import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from '@redwoodjs/forms';
import { navigate, routes } from '@redwoodjs/router';
import { Metadata } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { useAuth } from 'src/auth';

import SignupForm from './SignupForm';
import { SignupSchema, SignupSchemaType } from './SignupForm/SignupSchema';

// TODO: add timezone

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // redirect to home page if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  // focus on username box on page load
  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const onSubmit = async (data: SignupSchemaType) => {
    setServerError('');
    setIsSuccess(false);
    setIsLoading(true);
    const response = await signUp({
      username: data.email,
      password: data.password,
      name: data.name,
    });

    // handle errors
    if (response.error) {
      setIsLoading(false);
      setServerError(response.error);
      return;
    }

    setIsLoading(false);
    setIsSuccess(true);
    toast(response.message);
    form.reset();
  };

  return (
    <>
      <Metadata title="Signup" />
      <div className="mx-auto max-w-md">
        <SignupForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          isSuccess={isSuccess}
          serverError={serverError}
          form={form}
        />
      </div>
    </>
  );
};

export default SignupPage;
