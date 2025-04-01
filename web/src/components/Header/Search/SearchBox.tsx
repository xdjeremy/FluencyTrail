import { useEffect, useRef, useState } from 'react';

import { Search, X } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button } from '../../ui/button';
import { Dialog, DialogContent } from '../../ui/dialog';
import { Input } from '../../ui/input';

import SearchCell from './SearchCell';

const SearchBox = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [_selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useHotkeys('ctrl+k, cmd+k', e => {
    e.preventDefault();
    setOpen(open => !open);
  });

  // Close on escape
  useHotkeys(
    'escape',
    () => {
      if (open) setOpen(false);
    },
    { enableOnFormTags: true }
  );

  // Navigate results with arrow keys
  // useHotkeys(
  //   'arrowdown',
  //   e => {
  //     e.preventDefault();
  //     if (results.length) {
  //       setSelectedIndex((selectedIndex + 1) % results.length);
  //     }
  //   },
  //   { enableOnFormTags: true, enabled: open }
  // );

  // useHotkeys(
  //   'arrowup',
  //   e => {
  //     e.preventDefault();
  //     if (results.length) {
  //       setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
  //     }
  //   },
  //   { enableOnFormTags: true, enabled: open }
  // );

  // Select result with enter
  // useHotkeys(
  //   'enter',
  //   e => {
  //     e.preventDefault();
  //     if (results.length && open) {
  //       handleSelect(results[selectedIndex]);
  //     }
  //   },
  //   { enableOnFormTags: true, enabled: open }
  // );

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
  }, [open]);

  // const handleSelect = (item: MediaItem) => {
  //   setOpen(false);
  //   router.push(`/media/${item.id}`);
  // };

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

          <SearchCell query={search} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBox;
