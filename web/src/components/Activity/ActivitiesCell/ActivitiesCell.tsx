import {
  GetActivitiesForActivityList,
  GetActivitiesForActivityListVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import ActivityList from './ActivityList';

export const QUERY: TypedDocumentNode<
  GetActivitiesForActivityList,
  GetActivitiesForActivityListVariables
> = gql`
  query GetActivitiesForActivityList($itemsPerPage: Int!) {
    activities: activities(itemsPerPage: $itemsPerPage) {
      id
      date
      duration
      activityType
      notes
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div></div>;

export const Failure = ({
  error,
}: CellFailureProps<GetActivitiesForActivityList>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  activities,
}: CellSuccessProps<
  GetActivitiesForActivityList,
  GetActivitiesForActivityList
>) => {
  return <ActivityList activities={activities} />;
};
