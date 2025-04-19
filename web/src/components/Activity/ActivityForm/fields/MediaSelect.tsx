import { useCallback, useState } from 'react';

import { format } from 'date-fns';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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
 * - Clears state when closing without selection
 */
const ActivityMediaSelect = ({
  /** Pass through loading state from parent form */
  isLoading,
}: {
  isLoading: boolean;
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);
  const form = useFormContext();

  const { data, loading } = useQuery(SEARCH_MEDIA_QUERY, {
    variables: {
      query: debouncedSearch,
    },
    fetchPolicy: 'cache-and-network',
    skip: !open || !debouncedSearch || debouncedSearch.length < 3, // Require at least 3 chars
  });

  // Memoize filter function to prevent unnecessary re-renders
  const filterResults = useCallback(
    (medias: typeof data.searchMedias) =>
      medias?.filter(media =>
        media.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [data, searchValue]
  );

  // Filter results client-side based on current search value
  const filteredResults = data?.searchMedias
    ? filterResults(data.searchMedias)
    : undefined;

  // Handle input value changes and form state updates
  // - Clear existing selections
  // - Set customMediaTitle if input doesn't match any result
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);

      // Clear both fields first
      form.setValue('mediaSlug', '');
      form.setValue('customMediaTitle', '');

      // Only set customMediaTitle if there's a value and no exact match in results
      if (value) {
        const exactMatch = filteredResults?.find(
          m => m.title.toLowerCase() === value.toLowerCase()
        );
        if (exactMatch) {
          form.setValue('mediaSlug', exactMatch.slug);
          form.setValue('customMediaTitle', '');
          setOpen(false);
          form.setFocus('activityType');
        } else {
          form.setValue('customMediaTitle', value);
        }
      }
    },
    [filteredResults, form, setOpen, setSearchValue]
  );

  // Handle selection of an existing media from search results
  // - Close popover and clear search
  // - Wait for state updates
  // - Update form values and focus next field
  const handleSelect = useCallback(
    async (slug: string) => {
      const selectedMedia = data?.searchMedias.find(m => m.slug === slug);
      if (selectedMedia) {
        // First close the popover and clear the search
        setOpen(false);
        setSearchValue('');

        // Wait for state updates before form changes
        await Promise.resolve();

        // Then update the form values
        form.setValue('mediaSlug', slug);
        form.setValue('customMediaTitle', '');
        form.setFocus('activityType');
      }
    },
    [data?.searchMedias, form, setOpen, setSearchValue]
  );

  // Handle custom media creation with keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        searchValue &&
        (!filteredResults || filteredResults.length === 0)
      ) {
        e.preventDefault();
        form.setValue('customMediaTitle', searchValue);
        setOpen(false);
        setSearchValue('');
        form.setFocus('activityType');
      }
    },
    [filteredResults, form, searchValue, setOpen, setSearchValue]
  );

  // Clear all media-related form values and search state
  const clearSelection = useCallback(() => {
    form.setValue('mediaSlug', '');
    form.setValue('customMediaTitle', '');
    setSearchValue('');
  }, [form, setSearchValue]);

  const handleButtonClick = useCallback(
    (value?: string) => {
      if (!value) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean, value?: string) => {
      if (!isOpen) {
        if (!value) {
          clearSelection();
        } else {
          setSearchValue('');
        }
      }
      setOpen(isOpen);
    },
    [clearSelection, setOpen, setSearchValue]
  );

  return (
    <FormField
      control={form.control}
      name="mediaSlug"
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Media (optional)</FormLabel>
          <Popover
            open={open}
            onOpenChange={isOpen => handleOpenChange(isOpen, field.value)}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'col-span-3 justify-between',
                    !field.value &&
                      !form.watch('customMediaTitle') &&
                      'text-muted-foreground'
                  )}
                  disabled={isLoading || loading}
                  onClick={() => handleButtonClick(field.value)}
                >
                  {form.watch('customMediaTitle') ||
                    (field.value && !loading
                      ? data?.searchMedias?.find(m => m.slug === field.value)
                          ?.title || field.value
                      : searchValue || 'Select media')}
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ChevronsUpDown className="size-4 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command shouldFilter={false} onKeyDown={handleKeyDown}>
                <CommandInput
                  disabled={loading}
                  placeholder="Search media or type to create new..."
                  className="h-9"
                  value={searchValue}
                  onValueChange={handleSearch}
                />
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandEmpty>
                    {loading ? (
                      <div className="text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm">
                        <Loader2 className="size-3 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    ) : searchValue &&
                      (!filteredResults || filteredResults.length === 0) ? (
                      <div className="px-4 py-3 text-sm text-green-600">
                        Press Enter to create &ldquo;{searchValue}&rdquo;
                      </div>
                    ) : searchValue ? (
                      <div className="text-muted-foreground px-4 py-3 text-sm">
                        {searchValue.length < 3
                          ? 'Type at least 3 characters to search...'
                          : 'No results found'}
                      </div>
                    ) : null}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredResults?.map(media => (
                      <CommandItem
                        value={media.slug}
                        key={media.slug}
                        onSelect={() => handleSelect(media.slug)}
                      >
                        {media.title}{' '}
                        {media.date &&
                          `(${format(new Date(media.date), 'yyyy')})`}
                        <Check
                          className={cn(
                            'ml-auto size-4',
                            media.slug === field.value
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
