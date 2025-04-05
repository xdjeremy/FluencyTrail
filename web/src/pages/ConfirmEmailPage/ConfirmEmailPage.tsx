import { useEffect } from 'react';

import { navigate, routes } from '@redwoodjs/router';
import { Metadata, useMutation } from '@redwoodjs/web';

import { useAuth } from 'src/auth';

import ConfirmEmailError from './ConfirmEmailError';
import ConfirmEmailLoading from './ConfirmEmailLoading';
import ConfirmEmailSuccess from './ConfirmEmailSuccess';

const CONFIRM_EMAIL_MUTATION = gql`
  mutation ConfirmEmailMutation($token: String!) {
    confirmUserEmail(token: $token) {
      id
      emailVerified
    }
  }
`;

const ConfirmEmailPage = ({ token }: { token: string }) => {
  const { isAuthenticated } = useAuth();
  const [confirmEmail, { error, loading, called }] = useMutation(
    CONFIRM_EMAIL_MUTATION
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    confirmEmail({
      variables: { token },
    });
  }, [token, confirmEmail]);

  return (
    <>
      <Metadata title="Confirm Email" description="ConfirmEmail page" />
      {(loading || !called) && <ConfirmEmailLoading />}
      {error && <ConfirmEmailError errorMessage={error.message} />}
      {!loading && !error && called && <ConfirmEmailSuccess />}
    </>
  );
};

export default ConfirmEmailPage;
