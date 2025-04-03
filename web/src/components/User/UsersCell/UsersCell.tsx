import type { FindUsers, FindUsersVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import Users from 'src/components/User/Users';

export const QUERY: TypedDocumentNode<FindUsers, FindUsersVariables> = gql`
  query FindUsers {
    users {
      id
      email
      hashedPassword
      salt
      resetToken
      resetTokenExpiresAt
      createdAt
      updatedAt
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No users yet.{' '}
      {/* <Link to={routes.newUser()} className="rw-link">
        Create one?
      </Link> */}
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps<FindUsers>) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  users,
}: CellSuccessProps<FindUsers, FindUsersVariables>) => {
  return <Users users={users} />;
};
