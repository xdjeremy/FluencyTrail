import {
  FindActivitiesForRecentActivities,
  FindActivitiesForRecentActivitiesVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import {
  ImmersionCardEmpty,
  ImmersionCardError,
  ImmersionCardLoading,
  ImmersionTrackerCard,
} from './ImmersionTrackerCard';

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

export const Loading = () => <ImmersionCardLoading />;

export const Empty = () => <ImmersionCardEmpty />;

export const Failure = ({
  error,
}: CellFailureProps<FindActivitiesForRecentActivitiesVariables>) => (
  <ImmersionCardError error={error.message} />
);

export const Success = ({
  activities,
}: CellSuccessProps<
  FindActivitiesForRecentActivities,
  FindActivitiesForRecentActivitiesVariables
>) => {
  return <ImmersionTrackerCard activities={activities} />;
};
