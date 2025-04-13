import { useState } from 'react';

import { format } from 'date-fns';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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
    media: medias(query: $query) {
      title
      slug
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
    fetchPolicy: 'cache-and-network',
  });

  // Allow typing in search field
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  // Handle media selection
  const handleMediaSelect = (slug: string) => {
    form.setValue('mediaSlug', slug);
    form.setValue('customMediaTitle', '');
    form.setFocus('activityType');
    setSearchValue(''); // Clear search after selection
    setIsPopoverOpen(false); // Close dropdown after selection
  };

  // Handle custom media creation
  const handleCreateCustomMedia = (title: string) => {
    form.setValue('mediaSlug', '');
    form.setValue('customMediaTitle', title);
    form.setFocus('activityType');
    setSearchValue(''); // Clear search after selection
    setIsPopoverOpen(false); // Close dropdown after selection
  };

  // Get current values
  const currentMediaSlug = form.watch('mediaSlug');
  const currentCustomMedia = form.watch('customMediaTitle');

  // Get display title
  const getDisplayTitle = () => {
    if (currentMediaSlug) {
      return data?.media.find(media => media.slug === currentMediaSlug)?.title;
    }
    if (currentCustomMedia) {
      return currentCustomMedia;
    }
    return 'Select media (optional)';
  };

  return (
    <FormField
      control={form.control}
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
                      !currentCustomMedia &&
                      'text-muted-foreground'
                  )}
                  disabled={isLoading}
                  onClick={() => setIsPopoverOpen(true)}
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
                  {searchValue && !data?.media?.length && (
                    <>
                      <CommandEmpty className="py-2 text-sm">
                        No media found. You can:
                      </CommandEmpty>
                      <CommandGroup>
                        {/* Option 1: Use search text as title */}
                        <CommandItem
                          onSelect={() => handleCreateCustomMedia(searchValue)}
                          className="gap-2"
                        >
                          <Plus className="size-4" />
                          Create &quot;{searchValue}&quot;
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                  {data?.media && data.media.length > 0 && (
                    <CommandGroup>
                      {data.media.map(media => (
                        <CommandItem
                          value={media.slug}
                          key={media.slug}
                          onSelect={() => handleMediaSelect(media.slug)}
                        >
                          {media.title} (
                          {format(new Date(media.releaseDate), 'yyyy')})
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
                  )}
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
