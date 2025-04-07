import type {
  GetTotalTimeQuery,
  GetTotalTimeQueryVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import {
  TotalTimeCard,
  TotalTimeCardEmpty,
  TotalTimeCardError,
  TotalTimeCardLoading,
} from './TotalTimeCard';

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

export const Loading = () => <TotalTimeCardLoading />;

export const Empty = () => <TotalTimeCardEmpty />;

export const Failure = ({
  error,
}: CellFailureProps<GetTotalTimeQueryVariables>) => (
  <TotalTimeCardError error={error} />
);

export const Success = ({
  totalTime,
}: CellSuccessProps<GetTotalTimeQuery, GetTotalTimeQueryVariables>) => {
  return <TotalTimeCard totalTime={totalTime} />;
};
