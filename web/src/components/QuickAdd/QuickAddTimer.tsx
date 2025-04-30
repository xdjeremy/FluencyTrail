import { Clock } from 'lucide-react';
import {
  GetActiveTimerForQuickAdd,
  GetActiveTimerForQuickAddVariables,
} from 'types/graphql';

import { useQuery } from '@redwoodjs/web';

import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

import { DropdownMenuItem } from '../ui/dropdown-menu';

// This component is a switch statement that will show the timer form if there is no active timer
// and if there is an active timer, it will show the timer

const GET_ACTIVTE_TIMER = gql`
  query GetActiveTimerForQuickAdd {
    activeTimer: activeTimer {
      id
    }
  }
`;

const QuickAddTimer = () => {
  // we need to check if there is already an active timer
  // if there is, we should not show the modal form
  const { data: activeTimer } = useQuery<
    GetActiveTimerForQuickAdd,
    GetActiveTimerForQuickAddVariables
  >(GET_ACTIVTE_TIMER);

  const { setActivityTimerModalOpen, setActiveTimerModalOpen } =
    useActivityModal();
  return (
    <>
      {activeTimer?.activeTimer ? (
        <DropdownMenuItem
          onClick={() => setActiveTimerModalOpen(true)}
          className="cursor-pointer"
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>Show Active Timer</span>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          onClick={() => setActivityTimerModalOpen(true)}
          className="cursor-pointer"
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>Start Timer</span>
        </DropdownMenuItem>
      )}
    </>
  );
};

export default QuickAddTimer;
