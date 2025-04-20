import {
  LanguageSettingsQuery,
  LanguageSettingsQueryVariables,
} from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import LanguageSettings from './tab';

export const QUERY: TypedDocumentNode<
  LanguageSettingsQuery,
  LanguageSettingsQueryVariables
> = gql`
  query LanguageSettingsQuery {
    user: user {
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
    languages {
      id
      code
      name
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<LanguageSettingsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  languages,
  user,
}: CellSuccessProps<LanguageSettingsQuery, LanguageSettingsQueryVariables>) => {
  return <LanguageSettings user={user} languages={languages} />;
};
