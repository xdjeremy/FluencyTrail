import type {
  DeleteActivityMutation,
  DeleteActivityMutationVariables,
  FindActivityById,
} from 'types/graphql';

import { Link, routes, navigate } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import type { TypedDocumentNode } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { formatEnum, timeTag } from 'src/lib/formatters';

const DELETE_ACTIVITY_MUTATION: TypedDocumentNode<
  DeleteActivityMutation,
  DeleteActivityMutationVariables
> = gql`
  mutation DeleteActivityMutation($id: String!) {
    deleteActivity(id: $id) {
      id
    }
  }
`;

interface Props {
  activity: NonNullable<FindActivityById['activity']>;
}

const Activity = ({ activity }: Props) => {
  const [deleteActivity] = useMutation(DELETE_ACTIVITY_MUTATION, {
    onCompleted: () => {
      toast.success('Activity deleted');
      navigate(routes.activities());
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteActivityMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete activity ' + id + '?')) {
      deleteActivity({ variables: { id } });
    }
  };

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Activity {activity.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{activity.id}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{activity.userId}</td>
            </tr>
            <tr>
              <th>Activity type</th>
              <td>{formatEnum(activity.activityType)}</td>
            </tr>
            <tr>
              <th>Notes</th>
              <td>{activity.notes}</td>
            </tr>
            <tr>
              <th>Duration</th>
              <td>{activity.duration}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{timeTag(activity.date)}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(activity.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(activity.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editActivity({ id: activity.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(activity.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Activity;
