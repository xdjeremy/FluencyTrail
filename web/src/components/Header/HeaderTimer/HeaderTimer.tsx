import { useEffect, useMemo, useState } from 'react';

import { Clock } from 'lucide-react';
import { GetActivityTimerForHeader } from 'types/graphql';

import { Button } from 'src/components/ui/button';

interface HeaderTimerProps {
  activeTimer: GetActivityTimerForHeader['activeTimer'];
}

const HeaderTimer = ({ activeTimer }: HeaderTimerProps) => {
  const [elapsed, setElapsed] = useState(0);
  const startTime = useMemo(
    () => new Date(activeTimer?.startTime).getTime(),
    [activeTimer?.startTime]
  );

  useEffect(() => {
    const calculateElapsed = () => {
      setElapsed(Date.now() - startTime);
    };

    // Immediate first update
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    // Cleanup on unmount or startTime change
    return () => clearInterval(interval);
  }, [startTime]);

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
