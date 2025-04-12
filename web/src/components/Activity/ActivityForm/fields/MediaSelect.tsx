import { useState } from 'react';

import { format } from 'date-fns';
import { Check, ChevronsUpDown } from 'lucide-react';
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
  const debouncedSearch = useDebounce(searchValue, 500);
  const form = useFormContext();

  const { data } = useQuery(SEARCH_MEDIA_QUERY, {
    variables: {
      query: debouncedSearch,
    },
    fetchPolicy: 'cache-and-network',
  });

  // Update customMediaTitle when search value changes and no results
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
    // Clear mediaSlug if we're typing (since we might be creating custom media)
    if (value) {
      form.setValue('mediaSlug', '');
    }
    // Update customMediaTitle for potential custom media creation
    form.setValue('customMediaTitle', value);
  };

  // When selecting existing media, clear customMediaTitle
  const handleMediaSelect = (slug: string) => {
    form.setValue('mediaSlug', slug);
    form.setValue('customMediaTitle', '');
    form.setFocus('activityType');
  };

  return (
    <FormField
      control={form.control}
      name="mediaSlug"
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Media*</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'col-span-3 justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  {field.value
                    ? data?.media.find(media => media.slug === field.value)
                        ?.title
                    : searchValue
                      ? searchValue
                      : 'Search or create media'}
                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput
                  placeholder="Search or create media..."
                  className="h-9"
                  value={searchValue}
                  onValueChange={handleSearchValueChange}
                />
                <CommandList>
                  <CommandEmpty className="p-4">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2 text-sm">
                        No media found - your search term will be used to create
                        new custom media
                      </p>
                      <div className="bg-muted rounded-md p-2">
                        <p className="mb-1 text-xs font-medium">Preview:</p>
                        <p className="text-sm">{searchValue}</p>
                      </div>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {data?.media.map(media => (
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
