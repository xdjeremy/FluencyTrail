import { useEffect, useRef, useState } from 'react';

import { Search, X } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import useDebounce from 'src/lib/hooks/useDebounce';

import { Button } from '../../ui/button';
import { Dialog, DialogContent } from '../../ui/dialog';
import { Input } from '../../ui/input';

import SearchCell from './SearchCell';
import { useSearchNavigation } from './useSearchNavigation';

const SearchBox = () => {
  const { open, setOpen, setSelectedIndex } = useSearchNavigation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300); // 300 ms debounce delay
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useHotkeys('ctrl+k, cmd+k', e => {
    e.preventDefault();
    setOpen(!open);
  });

  // Close on escape
  useHotkeys(
    'escape',
    () => {
      if (open) setOpen(false);
    },
    { enableOnFormTags: true }
  );

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open, setSelectedIndex]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="focus-visible:ring-ring ring-offset-background inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl gap-0 p-0">
          <div className="flex items-center border-b border-neutral-200 px-4 dark:border-neutral-800">
            <Search className="mr-2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <Input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for movies, TV shows, books..."
              className="h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button
              onClick={() => setOpen(false)}
              className="ml-2 rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <SearchCell query={debouncedSearch} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBox;
