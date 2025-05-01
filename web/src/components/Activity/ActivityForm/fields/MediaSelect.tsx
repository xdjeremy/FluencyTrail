import { useCallback, useEffect, useRef, useState } from 'react';

import { format } from 'date-fns';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import {
  SearchMediaForActivitySelect,
  SearchMediaForActivitySelectVariables,
} from 'types/graphql';

import { useFormContext } from '@redwoodjs/forms';
import { TypedDocumentNode, useQuery } from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'src/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/ui/popover';
import useDebounce from 'src/lib/hooks/useDebounce';
import { cn } from 'src/utils/cn';

const SEARCH_MEDIA_QUERY: TypedDocumentNode<
  SearchMediaForActivitySelect,
  SearchMediaForActivitySelectVariables
> = gql`
  query SearchMediaForActivitySelect($query: String!) {
    searchMedias: searchMedias(query: $query) {
      title
      slug
      date
    }
  }
`;

/**
 * Media Select component that supports both TMDB media search and custom media creation
 * - Searches TMDB when 3+ characters are typed
 * - Create custom media by typing and pressing Enter when no results
 * - Keyboard navigation: Arrow keys to navigate, Enter to select/create
 * - Clears state when closing without selection or explicitly cleared
 */
const ActivityMediaSelect = ({
  /** Pass through loading state from parent form */
  isLoading,
}: {
  isLoading: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useFormContext();
  const currentMediaSlug = form.watch('mediaSlug');
  const currentCustomMediaTitle = form.watch('customMediaTitle');

  const [searchValue, setSearchValue] = useState('');
  // State to hold the title of the selected existing media for display purposes
  const [selectedMediaTitle, setSelectedMediaTitle] = useState<string | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, loading } = useQuery(SEARCH_MEDIA_QUERY, {
    variables: {
      query: debouncedSearch,
    },
    fetchPolicy: 'cache-and-network',
    skip: !open || !debouncedSearch || debouncedSearch.length < 3, // Require at least 3 chars
  });

  // Focus input when popover opens or during loading
  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus();
    }
  }, [open, loading]);

  // Memoize filter function to prevent unnecessary re-renders
  const filterResults = useCallback(
    (medias: typeof data.searchMedias) =>
      medias?.filter(media =>
        media.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [data, searchValue] // Only depends on searchValue now
  );

  // Filter results client-side based on current search value
  const filteredResults = data?.searchMedias
    ? filterResults(data.searchMedias)
    : undefined;

  // Effect to initialize selectedMediaTitle if mediaSlug exists on mount
  useEffect(() => {
    if (currentMediaSlug && data?.searchMedias && !selectedMediaTitle) {
      const initialMedia = data.searchMedias.find(
        m => m.slug === currentMediaSlug
      );
      if (initialMedia) {
        setSelectedMediaTitle(initialMedia.title);
      } else {
        // If slug exists but not in initial search data, maybe show slug? Or fetch title?
        // For now, fallback to slug if title not found in current data
        setSelectedMediaTitle(currentMediaSlug);
      }
    }
    // Only run when data changes or on initial mount if slug exists
  }, [data?.searchMedias, currentMediaSlug, selectedMediaTitle]);

  // Simplified search handler: just updates the search value state
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      // Do NOT clear form fields here
    },
    [setSearchValue]
  );

  // Handle selection of an existing media from search results
  const handleSelect = useCallback(
    (slug: string, title: string) => {
      form.setValue('mediaSlug', slug);
      form.setValue('customMediaTitle', undefined); // Explicitly set to undefined
      setSelectedMediaTitle(title); // Store title for display
      setSearchValue(''); // Clear search input
      setOpen(false); // Close popover
      form.setFocus('activityType'); // Move focus
      // Manually trigger validation for the fields involved in the refine check
      form.trigger(['mediaSlug', 'customMediaTitle']);
    },
    [form, setSelectedMediaTitle, setSearchValue, setOpen]
  );

  // Clear all media-related form values and local state
  const clearSelection = useCallback(() => {
    form.setValue('mediaSlug', undefined); // Set to undefined
    form.setValue('customMediaTitle', undefined); // Set to undefined
    setSelectedMediaTitle(null);
    setSearchValue('');
  }, [form, setSelectedMediaTitle, setSearchValue]);

  // Handle popover open/close changes
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Popover is closing
        const currentSlug = form.getValues('mediaSlug');
        if (!currentSlug && searchValue) {
          // No existing media selected, but there was text in search input
          form.setValue('customMediaTitle', searchValue);
          form.setValue('mediaSlug', undefined); // Ensure slug is undefined
          setSelectedMediaTitle(searchValue); // Display the custom title
          setSearchValue(''); // Clear search input state
        } else if (!currentSlug && !searchValue) {
          // No selection and no search text, ensure everything is clear
          form.setValue('customMediaTitle', undefined); // Set to undefined
          setSelectedMediaTitle(null);
        }
        // If currentSlug exists, handleSelect already did the work.
        // If closing with empty search, do nothing extra.
      }
    },
    [form, searchValue, setSearchValue, setSelectedMediaTitle, setOpen]
  );

  // Determine the text to display on the button
  const displayValue =
    currentCustomMediaTitle || selectedMediaTitle || 'Select media';

  return (
    <FormField
      control={form.control}
      name="mediaSlug" // Still control mediaSlug, but display logic is separate
      render={() => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Media (optional)</FormLabel>
          <Popover open={open} onOpenChange={handleOpenChange}>
            <div className="col-span-3 flex items-center gap-1">
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'relative w-full justify-between', // Added relative positioning
                      displayValue === 'Select media' && 'text-muted-foreground'
                    )}
                    disabled={isLoading || loading}
                  >
                    <span className="truncate">{displayValue}</span>
                    {/* Use absolute positioning for loading indicator */}
                    {loading && (
                      <Loader2 className="absolute right-2 ml-2 size-4 shrink-0 animate-spin" />
                    )}
                    <ChevronsUpDown
                      className={cn(
                        'ml-2 size-4 shrink-0 transition-opacity duration-150',
                        loading ? 'opacity-0' : 'opacity-50'
                      )}
                    />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              {/* Add a clear button */}
              {(currentMediaSlug || currentCustomMediaTitle) && !isLoading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={clearSelection}
                  aria-label="Clear media selection"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
            <PopoverContent className="p-0">
              <Command shouldFilter={false}>
                {' '}
                {/* Add shouldFilter={false} back */}
                <CommandInput
                  ref={inputRef}
                  disabled={isLoading || loading}
                  placeholder="Search or type to create..."
                  className="h-9 text-base"
                  value={searchValue}
                  autoComplete="off"
                  inputMode="search"
                  onValueChange={handleSearch}
                />
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandEmpty>
                    <div
                      className={cn(
                        'text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm transition-opacity duration-150',
                        loading ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <Loader2 className="size-3 animate-spin" />
                      <span>Searching...</span>
                    </div>
                    {!loading && searchValue ? (
                      <div className="text-muted-foreground px-4 py-3 text-sm">
                        {searchValue.length < 3
                          ? 'Type 3+ characters to search...'
                          : 'No results found. Click away to create.'}
                      </div>
                    ) : (
                      <div className="text-muted-foreground px-4 py-3 text-sm">
                        Type to search or create new media.
                      </div>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredResults?.map(media => (
                      <CommandItem
                        value={media.slug} // Keep value for potential filtering/accessibility
                        key={media.slug}
                        onSelect={() => handleSelect(media.slug, media.title)} // Pass title too
                      >
                        {media.title}{' '}
                        {media.date &&
                          `(${format(new Date(media.date), 'yyyy')})`}
                        <Check
                          className={cn(
                            'ml-auto size-4',
                            media.slug === currentMediaSlug // Check against watched value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ActivityMediaSelect;
