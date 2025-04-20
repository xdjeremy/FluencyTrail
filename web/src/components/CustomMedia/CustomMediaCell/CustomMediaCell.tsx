import {
  GetAllCustomMediasQuery,
  GetAllCustomMediasQueryVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

export const QUERY: TypedDocumentNode<
  GetAllCustomMediasQuery,
  GetAllCustomMediasQueryVariables
> = gql`
  query GetAllCustomMediasQuery {
    customMedia: customMedias {
      id
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<GetAllCustomMediasQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  customMedia,
}: CellSuccessProps<
  GetAllCustomMediasQuery,
  GetAllCustomMediasQueryVariables
>) => {
  return <div>{JSON.stringify(customMedia)}</div>;
};
