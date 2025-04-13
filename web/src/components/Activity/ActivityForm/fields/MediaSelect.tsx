/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { format } from 'date-fns';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
// Using 'any' for types due to generation issues
// import {
//   SearchMyContent,
//   SearchMyContentVariables,
// } from 'types/graphql';

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

// Use the unified search query
const SEARCH_MEDIA_QUERY: TypedDocumentNode<any, any> = gql`
  query SearchMyContentForMediaSelect($query: String!) {
    results: searchMyContent(query: $query) {
      id
      title
      slug # This is CustomMedia.id for CUSTOM type
      mediaType
      releaseDate
    }
  }
`;

const ActivityMediaSelect = ({ isLoading }: { isLoading: boolean }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);
  const form = useFormContext();

  const { data } = useQuery(SEARCH_MEDIA_QUERY, {
    variables: {
      query: debouncedSearch,
    },
    skip: !debouncedSearch || !isPopoverOpen, // Only query when popover is open and search term exists
    fetchPolicy: 'cache-and-network',
  });

  // Allow typing in search field
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  // Handle media selection (standard or existing custom)
  // 'slug' here is the value from SearchResultItem.slug
  const handleMediaSelect = (slug: string) => {
    form.setValue('mediaSlug', slug); // Store the slug (or CustomMedia ID)
    form.setValue('customMediaTitle', ''); // Clear custom title field
    form.setFocus('activityType');
    setSearchValue(''); // Clear search after selection
    setIsPopoverOpen(false); // Close dropdown after selection
  };

  // Handle creation of NEW custom media
  const handleCreateCustomMedia = (title: string) => {
    form.setValue('mediaSlug', ''); // Clear standard media slug
    form.setValue('customMediaTitle', title); // Set custom title
    form.setFocus('activityType');
    setSearchValue(''); // Clear search after selection
    setIsPopoverOpen(false); // Close dropdown after selection
  };

  // Get current values
  const currentMediaSlug = form.watch('mediaSlug'); // Stores slug or CustomMedia ID
  const currentCustomMediaTitle = form.watch('customMediaTitle'); // Stores title for NEW custom media

  // Get display title for the button
  const getDisplayTitle = () => {
    if (currentMediaSlug) {
      // Find the selected item (standard or existing custom) in the latest results
      // Note: This relies on the selected item being present in the *current* search results
      // which might not always be true if the search term changes after selection.
      // A more robust approach might involve storing the selected title separately.
      const selectedItem = data?.results.find(
        (item: any) => item.slug === currentMediaSlug
      );
      return selectedItem?.title ?? currentMediaSlug; // Fallback to slug/ID if title not found in current results
    }
    if (currentCustomMediaTitle) {
      return currentCustomMediaTitle; // Display title for NEW custom media
    }
    return 'Select media (optional)';
  };

  return (
    <FormField
      control={form.control}
      // Still use mediaSlug for the form field, it holds the identifier
      name="mediaSlug"
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Media</FormLabel>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'col-span-3 justify-between',
                    !currentMediaSlug &&
                      !currentCustomMediaTitle &&
                      'text-muted-foreground'
                  )}
                  disabled={isLoading}
                  // Remove onClick here, opening is handled by Popover state
                >
                  {getDisplayTitle()}
                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search media..."
                  className="h-9"
                  value={searchValue}
                  onValueChange={handleSearchValueChange}
                />
                <CommandList>
                  {/* Show create option only when searching and no results found */}
                  {searchValue && !data?.results?.length && (
                    <>
                      <CommandEmpty className="py-2 text-sm">
                        No media found. Create new?
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => handleCreateCustomMedia(searchValue)}
                          className="gap-2"
                        >
                          <Plus className="size-4" />
                          Create &ldquo;{searchValue}&ldquo;
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                  {/* Display search results (standard and existing custom) */}
                  {data?.results && data.results.length > 0 && (
                    <CommandGroup>
                      {data.results.map((item: any) => (
                        <CommandItem
                          // Use item.slug which is unique (Media.slug or CustomMedia.id)
                          value={item.slug}
                          key={item.id} // Use item.id for React key
                          onSelect={() => handleMediaSelect(item.slug)}
                        >
                          {item.title}
                          {item.releaseDate && (
                            <span className="text-muted-foreground ml-1 text-xs">
                              ({format(new Date(item.releaseDate), 'yyyy')})
                            </span>
                          )}
                          <Check
                            className={cn(
                              'ml-auto size-4',
                              // Check against field.value which holds the selected slug/ID
                              item.slug === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Ensure FormMessage targets the correct field if needed */}
          <FormMessage className="col-span-3 col-start-2" />
        </FormItem>
      )}
    />
  );
};

export default ActivityMediaSelect;
