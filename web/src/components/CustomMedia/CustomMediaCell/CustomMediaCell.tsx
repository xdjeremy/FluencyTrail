import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import type { CustomMediaWithMetadata } from '../customMedia.types';
import CustomMediaDetail from '../CustomMediaDetail';

export const QUERY: TypedDocumentNode<
  FindCustomMediaQuery,
  FindCustomMediaQueryVariables
> = gql`
  query FindCustomMediaForCell($id: String!) {
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
  // Cast to our typed version to satisfy CustomMediaDetail's prop type
  const typedCustomMedia = customMedia as CustomMediaWithMetadata;
  return <CustomMediaDetail customMedia={typedCustomMedia} />;
};
