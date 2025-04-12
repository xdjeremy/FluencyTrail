import { ChevronDown } from 'lucide-react';
import type {
  GetUserLanguagesForLanguageSelector,
  GetUserLanguagesForLanguageSelectorVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';

import LanguageSelector from './LanguageSelector';

export const QUERY: TypedDocumentNode<
  GetUserLanguagesForLanguageSelector,
  GetUserLanguagesForLanguageSelectorVariables
> = gql`
  # We reused the same query for the LanguageSelectorCell and the LanguageSelector
  query GetUserLanguagesForLanguageSelector {
    user: user {
      languages {
        name
        id
      }
      primaryLanguage {
        id
      }
    }
  }
`;

export const Loading = () => (
  <Button
    variant="outline"
    className="flex w-32 items-center justify-end gap-2"
  >
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </Button>
);

export const Empty = () => (
  <Button
    variant="outline"
    className="flex w-32 items-center justify-end gap-2"
  >
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </Button>
);

export const Failure = ({
  error,
}: CellFailureProps<GetUserLanguagesForLanguageSelectorVariables>) => (
  <Button variant="outline" className="flex w-32 items-center gap-2">
    {error.message}
  </Button>
);

export const Success = ({
  user,
}: CellSuccessProps<
  GetUserLanguagesForLanguageSelector,
  GetUserLanguagesForLanguageSelectorVariables
>) => {
  return <LanguageSelector user={user} />;
};
