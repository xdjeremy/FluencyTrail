// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web';

import AccountSettingsCell from 'src/components/Settings/AccountSettingsCell';

const AccountSettingsPage = () => {
  return (
    <>
      <Metadata title="AccountSettings" description="AccountSettings page" />

      <AccountSettingsCell />
    </>
  );
};

export default AccountSettingsPage;
