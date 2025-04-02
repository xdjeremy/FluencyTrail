import type { FindMediaQuery, FindMediaQueryVariables } from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import MediaDetails from '../MediaDetails';

export const QUERY: TypedDocumentNode<FindMediaQuery, FindMediaQueryVariables> =
  gql`
    query FindMediaQuery($slug: String!) {
      media: media(slug: $slug) {
        id
        title
        description
        originalTitle
        posterUrl
        popularity
        releaseDate
        mediaType
        MovieMetadata {
          genres
          originalLanguage
          runtime
        }
      }
    }
  `;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindMediaQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  media,
}: CellSuccessProps<FindMediaQuery, FindMediaQueryVariables>) => {
  return <MediaDetails media={media} />;
};
