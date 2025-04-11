import { useEffect } from 'react';

import {
  GetUserLanguagesForNewActivity,
  GetUserLanguagesForNewActivityVariables,
} from 'types/graphql';

import { useFormContext } from '@redwoodjs/forms';
import { TypedDocumentNode, useQuery } from '@redwoodjs/web';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';

import { ActivitySchemaType } from '../ActivitySchema';

const GET_USER_LANGUAGES_QUERY: TypedDocumentNode<
  GetUserLanguagesForNewActivity,
  GetUserLanguagesForNewActivityVariables
> = gql`
  query GetUserLanguagesForNewActivity {
    user {
      languages {
        id
        name
      }
      primaryLanguage {
        id
      }
    }
  }
`;

const LanguageSelect = () => {
  const form = useFormContext<ActivitySchemaType>();
  const { data, loading } = useQuery(GET_USER_LANGUAGES_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  // Set primary language as default value if available
  useEffect(() => {
    if (data?.user.primaryLanguage) {
      console.log('Setting default language:', data.user.primaryLanguage.id);
      form.setValue('languageId', data.user.primaryLanguage.id);
    }
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="languageId"
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Language*</FormLabel>
          <Select onValueChange={field.onChange} disabled={loading || !data}>
            <FormControl className="col-span-3">
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.user.languages &&
                data.user.languages.map(lang => (
                  <SelectItem
                    key={lang.id}
                    value={lang.id.toString()}
                    className="cursor-pointer"
                  >
                    {lang.name}
                  </SelectItem>
                ))}

              {!data?.user.languages.length ? (
                <div className="text-destructive p-2 text-sm">
                  Please add at least one language in Settings
                </div>
              ) : null}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LanguageSelect;
