import React from 'react';

import { OAuthButtons } from '@spoonjoy/redwoodjs-dbauth-oauth-web';

import { useOAuth } from 'src/auth';

const OAuthLogin = () => {
  const { getOAuthUrls } = useOAuth();

  return (
    <>
      <OAuthButtons
        action="login" // or 'signup'
        getOAuthUrls={getOAuthUrls}
      />
    </>
  );
};

export default OAuthLogin;
