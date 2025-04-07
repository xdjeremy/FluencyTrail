import type { GetStreakQuery, GetStreakQueryVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import {
  StreakCard,
  StreakCardEmpty,
  StreakCardFailure,
  StreakCardLoading,
} from './StreakCard';

export const QUERY: TypedDocumentNode<GetStreakQuery, GetStreakQueryVariables> =
  gql`
    query GetStreakQuery {
      streak {
        bestStreak
        currentStreak
      }
      completedToday
    }
  `;

export const Loading = () => <StreakCardLoading />;

export const Empty = () => <StreakCardEmpty />;

export const Failure = ({
  error,
}: CellFailureProps<GetStreakQueryVariables>) => (
  <StreakCardFailure error={error} />
);

export const Success = ({
  streak,
  completedToday,
}: CellSuccessProps<GetStreakQuery, GetStreakQueryVariables>) => {
  return <StreakCard streak={streak} completedToday={completedToday} />;
};
