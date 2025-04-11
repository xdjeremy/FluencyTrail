import {
  FindUserForProfileSettings,
  FindUserForProfileSettingsVariables,
} from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import AccountSettings from './tab';

export const QUERY: TypedDocumentNode<
  FindUserForProfileSettings,
  FindUserForProfileSettingsVariables
> = gql`
  query FindUserForProfileSettings {
    user: user {
      id
      email
      name
      timezone
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

    # Fetch all available languages for selection
    languages {
      id
      code
      name
    }
  }
`;

// TODO: implement states

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindUserForProfileSettingsVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  user,
  languages,
}: CellSuccessProps<
  FindUserForProfileSettings,
  FindUserForProfileSettingsVariables
>) => {
  return <AccountSettings user={user} languages={languages} />;
};
