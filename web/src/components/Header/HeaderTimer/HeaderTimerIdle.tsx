import { Play } from 'lucide-react';

import { Button } from 'src/components/ui/button';

const HeaderTimerIdle = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={
        'text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors'
      }
    >
      <Play className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">Start Timer</span>
    </Button>
  );
};

export default HeaderTimerIdle;
