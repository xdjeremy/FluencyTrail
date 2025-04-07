import type { GetStreakQuery, GetStreakQueryVariables } from 'types/graphql';

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import StreakCard from './StreakCard';

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

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<GetStreakQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  streak,
  completedToday,
}: CellSuccessProps<GetStreakQuery, GetStreakQueryVariables>) => {
  return <StreakCard streak={streak} completedToday={completedToday} />;
};
