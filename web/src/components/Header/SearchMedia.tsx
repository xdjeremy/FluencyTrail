import { useState } from 'react';

import { Search, X } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SearchMedia = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div
        className={`${isSearchOpen ? 'flex' : 'hidden'} relative w-full max-w-sm items-center md:flex`}
      >
        <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search lessons..."
          className="focus-visible:ring-brand-600 w-full rounded-full bg-gray-100 pl-8 pr-4"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 rounded-r-full md:hidden"
          onClick={() => setIsSearchOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close search</span>
        </Button>
      </div>
      {isSearchOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      )}
    </>
  );
};

export default SearchMedia;
