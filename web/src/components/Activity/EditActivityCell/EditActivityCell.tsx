import type {
  EditActivityById,
  UpdateActivityInput,
  UpdateActivityMutationVariables,
} from 'types/graphql';

import { navigate, routes } from '@redwoodjs/router';
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import ActivityForm from 'src/components/Activity/ActivityForm';

export const QUERY: TypedDocumentNode<EditActivityById> = gql`
  query EditActivityById($id: String!) {
    activity: activity(id: $id) {
      id
      userId
      activityType
      notes
      duration
      date
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_ACTIVITY_MUTATION: TypedDocumentNode<
  EditActivityById,
  UpdateActivityMutationVariables
> = gql`
  mutation UpdateActivityMutation($id: String!, $input: UpdateActivityInput!) {
    updateActivity(id: $id, input: $input) {
      id
      userId
      activityType
      notes
      duration
      date
      createdAt
      updatedAt
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({ activity }: CellSuccessProps<EditActivityById>) => {
  const [updateActivity, { loading, error }] = useMutation(
    UPDATE_ACTIVITY_MUTATION,
    {
      onCompleted: () => {
        toast.success('Activity updated');
        navigate(routes.activities());
      },
      onError: error => {
        toast.error(error.message);
      },
    }
  );

  const onSave = (
    input: UpdateActivityInput,
    id: EditActivityById['activity']['id']
  ) => {
    updateActivity({ variables: { id, input } });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Activity {activity?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ActivityForm
          activity={activity}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};
