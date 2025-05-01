import { useEffect, useMemo, useState } from 'react';

import { formatInTimeZone } from 'date-fns-tz';
import { Clock } from 'lucide-react';
import { GetActivityTimerForHeader } from 'types/graphql';

import { useAuth } from 'src/auth';
import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

interface HeaderTimerProps {
  activeTimer: GetActivityTimerForHeader['activeTimer'];
}

const HeaderTimer = ({ activeTimer }: HeaderTimerProps) => {
  const { setActiveTimerModalOpen } = useActivityModal();
  const { currentUser } = useAuth();

  const [elapsed, setElapsed] = useState(0);
  const startTime = useMemo(
    () => new Date(activeTimer?.startTime).getTime(),
    [activeTimer?.startTime]
  );

  useEffect(() => {
    const calculateElapsed = () => {
      // Get the current time in the user's timezone
      const now = new Date(
        formatInTimeZone(
          new Date(),
          currentUser.timezone,
          'yyyy-MM-dd HH:mm:ss'
        )
      ).getTime();
      setElapsed(now - startTime);
    };

    // Immediate first update
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    // Cleanup on unmount or startTime change
    return () => clearInterval(interval);
  }, [startTime, currentUser.timezone]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className={
        'flex items-center gap-1.5 rounded-full px-2 py-1 text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
      }
      onClick={() => setActiveTimerModalOpen(true)}
    >
      <>
        <Clock className={'h-3.5 w-3.5 animate-pulse'} />
        <span className="font-mono text-xs font-medium tabular-nums">
          {formatTime(elapsed)}
        </span>
      </>
    </Button>
  );
};

export default HeaderTimer;
