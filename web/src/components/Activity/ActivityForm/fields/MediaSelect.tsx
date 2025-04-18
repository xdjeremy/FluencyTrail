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
    searchMedias: searchMedias(query: $query) {
      title
      slug
      date
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
    skip: !debouncedSearch || debouncedSearch.length < 2,
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);

    // Clear both fields first
    form.setValue('mediaSlug', '');
    form.setValue('customMediaTitle', '');

    // Only set customMediaTitle if not selecting from results
    if (value && !data?.searchMedias?.some(m => m.title === value)) {
      form.setValue('customMediaTitle', value);
    }
  };

  const handleSelect = (slug: string) => {
    form.setValue('mediaSlug', slug);
    form.setValue('customMediaTitle', '');
    form.setFocus('activityType');
    setSearchValue('');
  };

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
          <Popover>
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
                  disabled={isLoading}
                  onClick={() => !field.value && clearSelection()}
                >
                  {field.value
                    ? data?.searchMedias.find(
                        media => media.slug === field.value
                      )?.title
                    : form.watch('customMediaTitle') || 'Select media'}
                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput
                  placeholder="Search media or type to create new..."
                  className="h-9"
                  value={searchValue}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {searchValue && (
                      <div className="px-4 py-3 text-sm text-green-600">
                        Press Enter to create &ldquo;{searchValue}&rdquo;
                      </div>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {data?.searchMedias.map(media => (
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
