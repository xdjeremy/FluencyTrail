import { useEffect, useMemo, useState } from 'react';

import { Clock, Square } from 'lucide-react';
import { GetActivityTimerForModal } from 'types/graphql';

import { Button } from 'src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

interface CurrentActivityTimerModalProps {
  activeTimer: GetActivityTimerForModal['activeTimer'];
}

const CurrentActivityTimerModal = ({
  activeTimer,
}: CurrentActivityTimerModalProps) => {
  const { isActiveTimerModalOpen, setActiveTimerModalOpen } =
    useActivityModal();

  const [elapsed, setElapsed] = useState(0);
  const startTime = useMemo(
    () => new Date(activeTimer?.startTime).getTime(),
    [activeTimer?.startTime]
  );

  useEffect(() => {
    if (!activeTimer) return;

    const calculateElapsed = () => {
      setElapsed(Date.now() - startTime);
    };

    // Immediate first update
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    // Cleanup on unmount or startTime change
    return () => clearInterval(interval);
  }, [startTime, activeTimer]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(elapsed);

  return (
    <Dialog
      open={isActiveTimerModalOpen}
      onOpenChange={setActiveTimerModalOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className={'text-brand-600 dark:text-brand-400 h-5 w-5'} />
            Activity Timer
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="mb-6 flex items-center justify-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={
                  'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex h-20 w-16 items-center justify-center rounded-lg font-mono text-4xl font-bold sm:text-5xl'
                }
              >
                {hours}
              </div>
              <span className="text-muted-foreground mt-1 text-xs">HOURS</span>
            </div>

            <div className="text-muted-foreground mx-1 text-2xl font-bold">
              :
            </div>

            <div className="flex flex-col items-center">
              <div
                className={
                  'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex h-20 w-16 items-center justify-center rounded-lg font-mono text-4xl font-bold sm:text-5xl'
                }
              >
                {minutes}
              </div>
              <span className="text-muted-foreground mt-1 text-xs">
                MINUTES
              </span>
            </div>

            <div className="text-muted-foreground mx-1 text-2xl font-bold">
              :
            </div>

            <div className="flex flex-col items-center">
              <div
                className={
                  'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex h-20 w-16 items-center justify-center rounded-lg font-mono text-4xl font-bold sm:text-5xl'
                }
              >
                {seconds}
              </div>
              <span className="text-muted-foreground mt-1 text-xs">
                SECONDS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm dark:bg-neutral-800">
            <span
              className={'h-2 w-2 animate-pulse rounded-full bg-green-500'}
            ></span>
            <span className="text-muted-foreground">Timer is running</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
          {/* <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              // onClick={pauseTimer}
              className="border-highlight-200 dark:border-highlight-800 hover:bg-highlight-100 dark:hover:bg-highlight-900/30 hover:text-highlight-700 dark:hover:text-highlight-300 gap-1.5"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>

            <Button
              variant="outline"
              // onClick={resetTimer}
              // disabled={time === 0}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div> */}

          <Button
            // onClick={handleStopTimer}
            // disabled={time === 0 || isSubmitting}
            className="bg-brand-600 hover:bg-brand-700 w-full gap-1.5 text-white sm:w-auto"
          >
            <Square className="h-4 w-4" />
            Complete Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CurrentActivityTimerModal;
