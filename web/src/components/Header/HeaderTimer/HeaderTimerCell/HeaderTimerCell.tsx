import type {
  GetActivityTimerForHeader,
  GetActivityTimerForHeaderVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import HeaderTimer from '../HeaderTimer';
import HeaderTimerIdle from '../HeaderTimerIdle';

export const beforeQuery = () => {
  return {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    notifyOnNetworkStatusChange: true,
  };
};

export const QUERY: TypedDocumentNode<
  GetActivityTimerForHeader,
  GetActivityTimerForHeaderVariables
> = gql`
  query GetActivityTimerForHeader {
    activeTimer: activeTimer {
      startTime
    }
  }
`;

export const Loading = () => <HeaderTimerIdle />;

export const Empty = () => <HeaderTimerIdle />;

export const Failure = ({
  error,
}: CellFailureProps<GetActivityTimerForHeaderVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  activeTimer,
}: CellSuccessProps<
  GetActivityTimerForHeader,
  GetActivityTimerForHeaderVariables
>) => {
  return <HeaderTimer activeTimer={activeTimer} />;
};
