import { Loader2, Square } from 'lucide-react';
import { useReward } from 'react-rewards';
import { toast } from 'sonner';
import {
  GetActivityTimerForModal,
  StopActivityTimerMutation,
  StopActivityTimerMutationVariables,
} from 'types/graphql';

import { useMutation } from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

const STOP_TIMER = gql`
  mutation StopActivityTimerMutation(
    $stopActivityTimer: UpdateActivityTimerInput!
  ) {
    stopActivityTimer: stopActivityTimer(input: $stopActivityTimer) {
      id
    }
  }
`;

interface StopTimerProps {
  activeTimer: GetActivityTimerForModal['activeTimer'];
}

const StopTimer = ({ activeTimer }: StopTimerProps) => {
  const { setActiveTimerModalOpen } = useActivityModal();
  const { reward } = useReward('rewardId', 'confetti', {
    elementCount: 150,
    startVelocity: 60,
  });

  const [mutation, { loading }] = useMutation<
    StopActivityTimerMutation,
    StopActivityTimerMutationVariables
  >(STOP_TIMER, {
    onCompleted: () => {
      reward();
      setActiveTimerModalOpen(false);
      toast.success('Activity recorded successfully');
    },
    onError: error => {
      toast.error(
        `Error stopping timer: ${error.message}. Please try again later.`
      );
    },
    refetchQueries: ['GetActivityTimerForHeader', 'GetActiveTimerForQuickAdd'],
  });

  return (
    <Button
      onClick={() =>
        mutation({
          variables: {
            stopActivityTimer: {
              id: activeTimer?.id,
            },
          },
        })
      }
      disabled={loading}
      variant="brand"
      className="w-full gap-1.5 sm:w-auto"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Square className="h-4 w-4" />
      )}
      Complete Activity
    </Button>
  );
};

export default StopTimer;
