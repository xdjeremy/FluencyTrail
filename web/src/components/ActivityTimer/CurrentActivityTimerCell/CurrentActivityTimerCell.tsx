import type {
  GetActivityTimerForModal,
  GetActivityTimerForModalVariables,
} from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import CurrentActivityTimerModal from './CurrentActivityTimerModal';

export const beforeQuery = () => {
  return {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    notifyOnNetworkStatusChange: true,
  };
};

export const QUERY: TypedDocumentNode<
  GetActivityTimerForModal,
  GetActivityTimerForModalVariables
> = gql`
  query GetActivityTimerForModal {
    activeTimer: activeTimer {
      id
      startTime
    }
  }
`;

export const Loading = () => null;

export const Empty = () => null;

export const Failure = ({
  error,
}: CellFailureProps<GetActivityTimerForModalVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  activeTimer,
}: CellSuccessProps<
  GetActivityTimerForModal,
  GetActivityTimerForModalVariables
>) => {
  return <CurrentActivityTimerModal activeTimer={activeTimer} />;
};
