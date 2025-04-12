import type {
  CreateCustomMediaInput,
  UpdateCustomMediaInput,
} from 'types/graphql';

import { Form, Submit, TextField } from '@redwoodjs/forms';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

const CREATE_CUSTOM_MEDIA = gql`
  mutation CreateCustomMediaMutation($input: CreateCustomMediaInput!) {
    createCustomMedia(input: $input) {
      id
      mediaId
      metadata
    }
  }
`;

const UPDATE_CUSTOM_MEDIA = gql`
  mutation UpdateCustomMediaMutation(
    $id: String!
    $input: UpdateCustomMediaInput!
  ) {
    updateCustomMedia(id: $id, input: $input) {
      id
      mediaId
      metadata
    }
  }
`;

interface CustomMediaFormProps {
  customMedia?: {
    id: string;
    mediaId: string;
    metadata: { title: string; [key: string]: unknown };
  };
  onSave: (
    data: CreateCustomMediaInput | UpdateCustomMediaInput,
    id?: string
  ) => void;
  loading: boolean;
  error?: Error;
}

const CustomMediaForm = (props: CustomMediaFormProps) => {
  const [createCustomMedia, { loading: createLoading, error: _createError }] =
    useMutation(CREATE_CUSTOM_MEDIA, {
      onCompleted: data => {
        toast.success('Custom media created');
        props.onSave(data.createCustomMedia, data.createCustomMedia.id);
      },
      onError: error => {
        toast.error(error.message);
      },
    });

  const [updateCustomMedia, { loading: updateLoading, error: _updateError }] =
    useMutation(UPDATE_CUSTOM_MEDIA, {
      onCompleted: data => {
        toast.success('Custom media updated');
        props.onSave(data.updateCustomMedia, props.customMedia?.id);
      },
      onError: error => {
        toast.error(error.message);
      },
    });

  const onSubmit = (data: Record<string, string>) => {
    const input = {
      mediaId: data.mediaId,
      metadata: {
        title: data.title,
        ...JSON.parse(data.metadata || '{}'),
      },
    };

    if (props.customMedia?.id) {
      updateCustomMedia({ variables: { id: props.customMedia.id, input } });
    } else {
      createCustomMedia({ variables: { input } });
    }
  };

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <TextField
          name="mediaId"
          defaultValue={props.customMedia?.mediaId}
          validation={{ required: true }}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <TextField
          name="title"
          defaultValue={props.customMedia?.metadata?.title}
          validation={{ required: true }}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          placeholder="Title"
        />

        <TextField
          name="metadata"
          defaultValue={JSON.stringify(props.customMedia?.metadata, null, 2)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          placeholder="Additional metadata (JSON)"
        />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading || createLoading || updateLoading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default CustomMediaForm;
