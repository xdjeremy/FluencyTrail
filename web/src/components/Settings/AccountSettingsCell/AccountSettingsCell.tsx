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
}: CellSuccessProps<
  FindUserForProfileSettings,
  FindUserForProfileSettingsVariables
>) => {
  return <AccountSettings user={user} />;
};
