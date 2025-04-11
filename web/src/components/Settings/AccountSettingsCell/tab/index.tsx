import { FindUserForProfileSettings } from 'types/graphql';

import { Separator } from 'src/components/ui/separator';

import AccountProfile from './AccountProfile';
import DeleteAccount from './DeleteAccount';
import Languages from './Languages';
import Password from './Password';

// Define props explicitly based on the Cell's QUERY structure
interface AccountSettingsProps {
  user: FindUserForProfileSettings['user'];
  // The Cell query returns a top-level 'languages' field
  languages: FindUserForProfileSettings['languages'];
}

const AccountSettings = ({ user, languages }: AccountSettingsProps) => {
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
      <Languages user={user} allLanguages={languages} />
      <Separator />
      <Password />
      <Separator />
      <DeleteAccount />
    </div>
  );
};

export default AccountSettings;
