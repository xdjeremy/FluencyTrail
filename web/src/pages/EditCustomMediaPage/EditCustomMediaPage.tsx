import { gql } from '@apollo/client';
import type {
  FindCustomMediaQuery,
  FindCustomMediaQueryVariables,
} from 'types/graphql';

import { navigate, routes } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';
import { useQuery } from '@redwoodjs/web';

import CustomMediaForm from 'src/components/CustomMedia/CustomMediaForm/CustomMediaForm';

const QUERY = gql`
  query FindCustomMediaForEditPage($id: String!) {
    customMedia: customMedia(id: $id) {
      id
      mediaId
      metadata
    }
  }
`;

const EditCustomMediaPage = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery<
    FindCustomMediaQuery,
    FindCustomMediaQueryVariables
  >(QUERY, {
    variables: { id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error.message}</div>;
  if (!data?.customMedia) return <div>Custom media not found</div>;

  return (
    <>
      <MetaTags title={`Edit Custom Media - ${data.customMedia.id}`} />
      <CustomMediaForm
        loading={loading}
        customMedia={{
          id: data.customMedia.id,
          mediaId: data.customMedia.mediaId,
          metadata: {
            title:
              ((data.customMedia.metadata as Record<string, unknown>)
                ?.title as string) || '',
            ...(typeof data.customMedia.metadata === 'object'
              ? (data.customMedia.metadata as Record<string, unknown>)
              : {}),
          },
        }}
        onSave={() =>
          navigate(
            (
              routes as unknown as {
                customMedia: (args: { id: string }) => string;
              }
            ).customMedia({ id: data.customMedia.id })
          )
        }
      />
    </>
  );
};

export default EditCustomMediaPage;
