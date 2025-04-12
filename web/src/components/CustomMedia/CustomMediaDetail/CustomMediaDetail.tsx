import { Link, routes, navigate } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';

import MetadataTable, {
  MetadataValue,
} from 'src/components/common/MetadataTable';

import type {
  CustomMediaWithMetadata,
  CustomMediaRoutes,
} from '../customMedia.types';

const ensureMetadataFormat = (
  metadata: CustomMediaWithMetadata['metadata']
): Record<string, MetadataValue> => {
  return metadata as Record<string, MetadataValue>;
};

interface CustomMediaDetailProps {
  customMedia: CustomMediaWithMetadata;
}

const DELETE_CUSTOM_MEDIA_MUTATION = gql`
  mutation DeleteCustomMediaMutation($id: String!) {
    deleteCustomMedia(id: $id) {
      id
    }
  }
`;

const CustomMediaDetail = ({ customMedia }: CustomMediaDetailProps) => {
  const [deleteCustomMedia] = useMutation(DELETE_CUSTOM_MEDIA_MUTATION, {
    onCompleted: () => {
      navigate((routes as CustomMediaRoutes).customMedias());
    },
  });

  const onDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this custom media?')) {
      deleteCustomMedia({ variables: { id } });
    }
  };
  if (!customMedia) return null;

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{customMedia.id}</td>
          </tr>
          <tr>
            <th>Media ID</th>
            <td>{customMedia.mediaId}</td>
          </tr>
          <tr>
            <th>Media Title</th>
            <td>{customMedia.media?.title || 'N/A'}</td>
          </tr>
          <tr>
            <th>Created At</th>
            <td>{new Date(customMedia.createdAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Updated At</th>
            <td>{new Date(customMedia.updatedAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th colSpan={2}>Metadata</th>
          </tr>
          <tr>
            <td colSpan={2}>
              <MetadataTable
                metadata={ensureMetadataFormat(customMedia.metadata)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <nav className="rw-button-group">
        <Link
          to={(routes as CustomMediaRoutes).editCustomMedia({
            id: customMedia.id,
          })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(customMedia.id)}
        >
          Delete
        </button>
      </nav>
    </div>
  );
};

export default CustomMediaDetail;
