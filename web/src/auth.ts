import {
  createOAuth,
  createOAuthClient,
} from '@spoonjoy/redwoodjs-dbauth-oauth-web';
import { toast } from 'sonner';

import { createAuth, createDbAuthClient } from '@redwoodjs/auth-dbauth-web';

// DBAuth client configuration
const dbAuthClient = createDbAuthClient();

export const { AuthProvider, useAuth } = createAuth(dbAuthClient);

// OAuth providers configuration
const onOAuthError = (error: string) => {
  toast.error(error);
};

const oAuthClient = createOAuthClient({
  enabledProviders: { apple: false, github: false, google: false },
});

export const { OAuthProvider, useOAuth } = createOAuth(
  oAuthClient,
  onOAuthError
);
