import type {
  FindActivityById,
  FindActivityByIdVariables,
} from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import Activity from 'src/components/Activity/Activity';

export const QUERY: TypedDocumentNode<
  FindActivityById,
  FindActivityByIdVariables
> = gql`
  query FindActivityById($id: String!) {
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

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Activity not found</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindActivityByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  activity,
}: CellSuccessProps<FindActivityById, FindActivityByIdVariables>) => {
  return <Activity activity={activity} />;
};
