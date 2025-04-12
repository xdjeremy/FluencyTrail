import type {
  FindCustomMediaQuery,
  FindCustomMediaQueryVariables,
} from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import CustomMediaDetail from '../CustomMediaDetail';

export const QUERY: TypedDocumentNode<
  FindCustomMediaQuery,
  FindCustomMediaQueryVariables
> = gql`
  query FindCustomMediaQuery($id: String!) {
    customMedia: customMedia(id: $id) {
      id
      mediaId
      metadata
      createdAt
      updatedAt
      media {
        id
        title
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Custom media not found</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindCustomMediaQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  customMedia,
}: CellSuccessProps<FindCustomMediaQuery, FindCustomMediaQueryVariables>) => {
  return <CustomMediaDetail customMedia={customMedia} />;
};
