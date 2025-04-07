import type {
  GetTotalTimeQuery,
  GetTotalTimeQueryVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import TotalTimeCard from './TotalTimeCard';

export const QUERY: TypedDocumentNode<
  GetTotalTimeQuery,
  GetTotalTimeQueryVariables
> = gql`
  query GetTotalTimeQuery {
    totalTime {
      totalTime
      vsLastWeek
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<GetTotalTimeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  totalTime,
}: CellSuccessProps<GetTotalTimeQuery, GetTotalTimeQueryVariables>) => {
  return <TotalTimeCard totalTime={totalTime} />;
};
