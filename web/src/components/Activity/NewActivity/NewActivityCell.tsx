import type {
  FindUserLanguagesForActivityQuery,
  FindUserLanguagesForActivityQueryVariables,
} from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import NewActivity from './NewActivity';

export const QUERY: TypedDocumentNode<
  FindUserLanguagesForActivityQuery,
  FindUserLanguagesForActivityQueryVariables
> = gql`
  query FindUserLanguagesForActivityQuery {
    user: user {
      id # Include id just in case, though not strictly needed by form
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

export const Loading = () => <NewActivity isLoadingLanguages />; // Pass loading state

export const Empty = () => (
  <div>User language data not found. Cannot add activity.</div>
);

export const Failure = ({
  error,
}: CellFailureProps<FindUserLanguagesForActivityQueryVariables>) => (
  <div style={{ color: 'red' }}>
    Error loading language data: {error?.message}
  </div>
);

export const Success = ({
  user,
}: CellSuccessProps<
  FindUserLanguagesForActivityQuery,
  FindUserLanguagesForActivityQueryVariables
>) => {
  // Pass the fetched data down to the NewActivity component
  return (
    <NewActivity
      userLanguages={user?.languages}
      primaryLanguageId={user?.primaryLanguage?.id}
    />
  );
};
