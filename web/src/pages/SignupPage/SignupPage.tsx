import { useEffect, useRef } from 'react';

import { navigate, routes } from '@redwoodjs/router';
import { Metadata } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { useAuth } from 'src/auth';

import SignupForm from './SignupForm';
import { SignupSchemaType } from './SignupForm/SignupSchema';

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth();

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
    const response = await signUp({
      username: data.email,
      password: data.password,
      name: data.name,
    });

    if (response.message) {
      toast(response.message);
    } else if (response.error) {
      toast.error(response.error);
    } else {
      // user is signed in automatically
      toast.success('Welcome!');
    }
  };

  return (
    <>
      <Metadata title="Signup" />
      <div className="mx-auto max-w-md">
        <SignupForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default SignupPage;
