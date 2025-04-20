import {
  GetAllCustomMediasQuery,
  GetAllCustomMediasQueryVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import CustomMediaTable from '../List/CustomMediaTable';
import EmptyCustomMedia from '../List/EmptyCustomMedia';

export const QUERY: TypedDocumentNode<
  GetAllCustomMediasQuery,
  GetAllCustomMediasQueryVariables
> = gql`
  query GetAllCustomMediasQuery {
    customMedia: customMedias {
      id
      title
      createdAt
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <EmptyCustomMedia />;

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
  return <CustomMediaTable customMedia={customMedia} />;
};
