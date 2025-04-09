import React from 'react';

import { FindUserForProfileSettings } from 'types/graphql';

import { Separator } from 'src/components/ui/separator';

import AccountProfile from './AccountProfile';
import Password from './Password';

const AccountSettings = ({ user }: FindUserForProfileSettings) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-muted-foreground text-sm">
          Update your account information and manage your profile.
        </p>
      </div>
      <Separator />
      <AccountProfile user={user} />
      <Separator />
      <Password />
    </div>
  );
};

export default AccountSettings;
