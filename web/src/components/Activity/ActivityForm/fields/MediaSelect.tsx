import { useState } from 'react';

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
 * - Searches TMDB when 2+ characters are typed
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
    skip: !open || !debouncedSearch || debouncedSearch.length < 2,
  });

  console.log(data);

  // Only show search results when:
  // 1. Popover is open
  // 2. Search value is not empty
  // 3. Search value matches debounced value (prevent flicker)
  // 4. Has actual search results
  const showSearchResults =
    open &&
    searchValue.length > 0 &&
    data?.searchMedias?.length > 0 &&
    searchValue === debouncedSearch;

  // Handle input value changes and form state updates
  // - Clear existing selections
  // - Set customMediaTitle if input doesn't match any result
  const handleSearch = (value: string) => {
    setSearchValue(value);

    // Clear both fields first
    form.setValue('mediaSlug', '');
    form.setValue('customMediaTitle', '');

    // Only set customMediaTitle if it's not an exact match with any search result
    if (value && value.length > 0 && data?.searchMedias) {
      const exactMatch = data.searchMedias.some(
        m => m.title.toLowerCase() === value.toLowerCase()
      );
      if (!exactMatch) {
        form.setValue('customMediaTitle', value);
      }
    }
  };

  // Handle selection of an existing media from search results
  // - Close popover and clear search
  // - Wait for state updates
  // - Update form values and focus next field
  const handleSelect = async (slug: string) => {
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
  };

  // Clear all media-related form values and search state
  const clearSelection = () => {
    form.setValue('mediaSlug', '');
    form.setValue('customMediaTitle', '');
    setSearchValue('');
  };

  return (
    <FormField
      control={form.control}
      name="mediaSlug"
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Media (optional)</FormLabel>
          <Popover
            open={open}
            onOpenChange={isOpen => {
              if (!isOpen && !field.value) {
                clearSelection();
              }
              setOpen(isOpen);
            }}
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
                  onClick={() => !field.value && clearSelection()}
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
              <Command
                shouldFilter={data?.searchMedias?.length > 0}
                onKeyDown={e => {
                  if (
                    e.key === 'Enter' &&
                    searchValue &&
                    !data?.searchMedias?.length
                  ) {
                    e.preventDefault();
                    form.setValue('customMediaTitle', searchValue);
                    setOpen(false);
                    setSearchValue('');
                    form.setFocus('activityType');
                  }
                }}
              >
                <CommandInput
                  disabled={loading}
                  placeholder="Search media or type to create new..."
                  className="h-9"
                  value={searchValue}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {loading ? (
                      <div className="text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm">
                        <Loader2 className="size-3 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    ) : searchValue ? (
                      <div className="px-4 py-3 text-sm text-green-600">
                        Press Enter to create &ldquo;{searchValue}&rdquo;
                      </div>
                    ) : null}
                  </CommandEmpty>
                  <CommandGroup>
                    {showSearchResults &&
                      data.searchMedias.map(media => (
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
