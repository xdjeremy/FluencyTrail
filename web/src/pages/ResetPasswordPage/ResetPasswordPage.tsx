import { useEffect, useRef, useState } from 'react';

import { navigate, routes } from '@redwoodjs/router';
import { Metadata } from '@redwoodjs/web';

import { useAuth } from 'src/auth';

import ResetPasswordError from './ResetPasswordError';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordLoading from './ResetPasswordLoading';

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { isAuthenticated, validateResetToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken);
      if (response.error) {
        setStatus('error');
        setErrMsg(response.error);
      } else {
        setStatus('idle');
      }
    };
    validateToken();
  }, [resetToken, validateResetToken]);

  const passwordRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  const render = () => {
    switch (status) {
      case 'loading':
        return <ResetPasswordLoading />;
      case 'error':
        return <ResetPasswordError errorMessage={errMsg} />;
      case 'idle':
        return <ResetPasswordForm resetToken={resetToken} />;
      default:
        return <ResetPasswordLoading />;
    }
  };

  return (
    <>
      <Metadata title="Reset Password" />

      {render()}
    </>
  );
};

export default ResetPasswordPage;
