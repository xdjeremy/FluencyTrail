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
  });

  console.log('data', data);

  return (
    <FormField
      control={form.control}
      name="mediaSlug"
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">Media</FormLabel>
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
                    ? data?.searchMedias.find(
                        media => media.slug === field.value
                      )?.title || 'Select media'
                    : 'Select media'}
                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command
                filter={(value, search) => {
                  const media = data?.searchMedias.find(m => m.slug === value);
                  const title = media?.title?.toLowerCase() || '';
                  return title.includes(search.toLowerCase()) ? 1 : 0;
                }}
              >
                <CommandInput
                  placeholder="Search activity..."
                  className="h-9"
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No media found.</CommandEmpty>
                  <CommandGroup>
                    {data &&
                      data.searchMedias.map(media => (
                        <CommandItem
                          // FIXME: some media titles are not unique
                          value={media.slug}
                          key={media.slug}
                          onSelect={() => {
                            form.setValue('mediaSlug', media.slug);
                            form.setFocus('activityType');
                          }}
                        >
                          {media.title}{' '}
                          {media.date
                            ? `(${format(new Date(media.date), 'yyyy')})`
                            : ''}
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
