import {
  FindActivitiesForRecentActivities,
  FindActivitiesForRecentActivitiesVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import ImmersionTrackerCard from './ImmersionTrackerCard';

export const QUERY: TypedDocumentNode<
  FindActivitiesForRecentActivities,
  FindActivitiesForRecentActivitiesVariables
> = gql`
  query FindActivitiesForRecentActivities {
    activities: activities(itemsPerPage: 5, page: 1) {
      id
      activityType
      duration
      notes
      date
      media {
        title
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindActivitiesForRecentActivitiesVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  activities,
}: CellSuccessProps<
  FindActivitiesForRecentActivities,
  FindActivitiesForRecentActivitiesVariables
>) => {
  return <ImmersionTrackerCard activities={activities} />;
};
