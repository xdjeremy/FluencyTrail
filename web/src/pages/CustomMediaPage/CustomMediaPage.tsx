import { gql } from '@apollo/client';
import type {
  FindCustomMediaQuery,
  FindCustomMediaQueryVariables,
} from 'types/graphql';

import { MetaTags, useQuery } from '@redwoodjs/web';

import type { CustomMediaWithMetadata } from 'src/components/CustomMedia/customMedia.types';
import CustomMediaDetail from 'src/components/CustomMedia/CustomMediaDetail/CustomMediaDetail';

const QUERY = gql`
  query FindCustomMediaForPage($id: String!) {
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

const CustomMediaPage = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery<
    FindCustomMediaQuery,
    FindCustomMediaQueryVariables
  >(QUERY, {
    variables: { id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error.message}</div>;
  if (!data?.customMedia) return <div>Custom media not found</div>;

  // Cast to our typed version
  const customMedia = data.customMedia as CustomMediaWithMetadata;

  return (
    <>
      <MetaTags title={`Custom Media - ${data.customMedia.id}`} />
      <CustomMediaDetail customMedia={customMedia} />
    </>
  );
};

export default CustomMediaPage;
