import { Metadata } from '@redwoodjs/web';

import LanguageSettingsCell from 'src/components/Settings/LanguageSettingsCell';

const LanguageSettingsPage = () => {
  return (
    <>
      <Metadata title="LanguageSettings" description="LanguageSettings page" />

      <LanguageSettingsCell />
    </>
  );
};

export default LanguageSettingsPage;
