import { Clock, FileText, Plus } from 'lucide-react';

import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

import NewActivity from '../Activity/NewActivity/NewActivity';
import NewActivityTimer from '../ActivityTimer/NewActivityTimer/NewActivityTimer';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const QuickAddButton = () => {
  const { setActivityModalOpen, setActivityTimerModalOpen } =
    useActivityModal();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full text-white shadow-lg dark:text-neutral-900"
            aria-label="Quick add options"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => setActivityTimerModalOpen(true)}
            className="cursor-pointer"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Start Timer</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setActivityModalOpen(true)}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Add Activity</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MODALS */}
      <NewActivity />
      <NewActivityTimer />
    </>
  );
};

export default QuickAddButton;
