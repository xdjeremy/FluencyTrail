import { LanguageSettingsQuery } from 'types/graphql';

import { Separator } from 'src/components/ui/separator';

import Languages from './Languages';

const LanguageSettings = ({ languages, user }: LanguageSettingsQuery) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Languages</h3>
        <p className="text-muted-foreground text-sm">
          Manage your languages and select your primary language for tracking.
        </p>
      </div>
      <Separator />

      <Languages user={user} languages={languages} />
    </div>
  );
};

export default LanguageSettings;
