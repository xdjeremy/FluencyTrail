import { useEffect, useState } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Skeleton } from '../ui/skeleton';
import { Toggle } from '../ui/toggle';

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Toggle>
        <Skeleton className="h-5 w-5" />
      </Toggle>
    );
  }

  return (
    <Toggle
      aria-label="Toggle dark mode"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="cursor-pointer text-neutral-700"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" data-testid="sun-icon" />
      ) : (
        <Moon className="h-5 w-5" data-testid="moon-icon" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Toggle>
  );
};

export default DarkModeToggle;
