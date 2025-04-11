import { useState } from 'react';

import {
  AddUserLanguageMutation,
  AddUserLanguageMutationVariables,
  FindUserForProfileSettings,
  RemoveUserLanguageMutation,
  RemoveUserLanguageMutationVariables,
  SetPrimaryLanguageMutation,
  SetPrimaryLanguageMutationVariables,
} from 'types/graphql';

import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { Button } from 'src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';

const ADD_USER_LANGUAGE = gql`
  mutation AddUserLanguageMutation($input: AddUserLanguageInput!) {
    addUserLanguage(input: $input) {
      id
      languages {
        id
        code
        name
      }
      primaryLanguage {
        id
        code
        name
      }
    }
  }
`;

const REMOVE_USER_LANGUAGE = gql`
  mutation RemoveUserLanguageMutation($input: RemoveUserLanguageInput!) {
    removeUserLanguage(input: $input) {
      id
      languages {
        id
        code
        name
      }
      primaryLanguage {
        id
        code
        name
      }
    }
  }
`;

const SET_PRIMARY_LANGUAGE = gql`
  mutation SetPrimaryLanguageMutation($input: SetPrimaryLanguageInput!) {
    setPrimaryLanguage(input: $input) {
      id
      languages {
        id
        code
        name
      }
      primaryLanguage {
        id
        code
        name
      }
    }
  }
`;

type QueryUser = NonNullable<FindUserForProfileSettings['user']>;
type QueryLanguage = NonNullable<
  FindUserForProfileSettings['languages']
>[number];

interface LanguagesProps {
  user: QueryUser;
  allLanguages: QueryLanguage[];
}

const Languages = ({ user, allLanguages }: LanguagesProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const [addUserLanguage] = useMutation<
    AddUserLanguageMutation,
    AddUserLanguageMutationVariables
  >(ADD_USER_LANGUAGE, {
    onCompleted: () => {
      toast.success('Language added successfully');
      setSelectedLanguage(''); // Reset selection
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const [removeUserLanguage] = useMutation<
    RemoveUserLanguageMutation,
    RemoveUserLanguageMutationVariables
  >(REMOVE_USER_LANGUAGE, {
    onCompleted: () => {
      toast.success('Language removed successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const [setPrimaryLanguage] = useMutation<
    SetPrimaryLanguageMutation,
    SetPrimaryLanguageMutationVariables
  >(SET_PRIMARY_LANGUAGE, {
    onCompleted: () => {
      toast.success('Primary language updated successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  // Filter out already added languages from the available options
  const availableLanguages = allLanguages.filter(
    lang => !user.languages?.some(userLang => userLang.id === lang.id)
  );

  const handleAddLanguage = () => {
    if (!selectedLanguage) return;

    const language = allLanguages.find(lang => lang.code === selectedLanguage);
    if (!language) return;

    addUserLanguage({
      variables: {
        input: {
          languageCode: language.code,
        },
      },
    });
  };

  const handleRemoveLanguage = (languageCode: string) => {
    removeUserLanguage({
      variables: {
        input: {
          languageCode,
        },
      },
    });
  };

  const handleSetPrimary = (languageCode: string) => {
    setPrimaryLanguage({
      variables: {
        input: {
          languageCode,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Languages</h3>
        <p className="text-muted-foreground text-sm">
          Manage your languages and select your primary language for tracking.
        </p>
      </div>

      {/* Add Language Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Language</CardTitle>
          <CardDescription>
            Add a new language to track your activities in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map(language => (
                <SelectItem key={language.code} value={language.code}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAddLanguage}
            disabled={!selectedLanguage}
          >
            Add Language
          </Button>
        </CardContent>
      </Card>

      {/* Language List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Languages</CardTitle>
          <CardDescription>
            Manage your added languages. Your primary language will be used as
            the default when logging activities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.languages?.map(language => (
            <div
              key={language.id}
              className="flex items-center justify-between border-b py-2 last:border-0"
            >
              <div>
                <span className="font-medium">{language.name}</span>
                {user.primaryLanguage?.id === language.id && (
                  <span className="text-muted-foreground ml-2 text-xs">
                    (Primary)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {user.primaryLanguage?.id !== language.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSetPrimary(language.code)}
                  >
                    Set as Primary
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveLanguage(language.code)}
                  disabled={user.primaryLanguage?.id === language.id}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {!user.languages?.length && (
            <p className="text-muted-foreground text-sm">
              No languages added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Languages;
