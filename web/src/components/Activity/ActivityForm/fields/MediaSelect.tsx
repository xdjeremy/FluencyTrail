import { useState } from 'react';

import { format } from 'date-fns';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import {
  SearchMediaForActivitySelect,
  SearchMediaForActivitySelectVariables,
} from 'types/graphql';

import { useFormContext } from '@redwoodjs/forms';
import { TypedDocumentNode, useQuery } from '@redwoodjs/web';

import CustomMediaForm from 'src/components/CustomMedia/CustomMediaForm/CustomMediaForm';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
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
  const [isCustomMediaModalOpen, setIsCustomMediaModalOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);
  const form = useFormContext();

  const { data } = useQuery(SEARCH_MEDIA_QUERY, {
    variables: {
      query: debouncedSearch,
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
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
                      ? data?.media.find(media => media.slug === field.value)
                          .title
                      : 'Select media'}
                    <ChevronsUpDown className="size-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Search activity..."
                    className="h-9"
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty className="p-4">
                      <div className="text-center">
                        <p className="mb-2 text-sm">No media found</p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mx-auto flex w-full items-center justify-center"
                          onClick={() => setIsCustomMediaModalOpen(true)}
                        >
                          <Plus className="mr-1 size-4" />
                          Create Custom Media
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {data &&
                        data.media.map(media => (
                          <CommandItem
                            value={media.slug}
                            key={media.slug}
                            onSelect={() => {
                              form.setValue('mediaSlug', media.slug);
                              form.setFocus('activityType');
                            }}
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
      <Dialog
        open={isCustomMediaModalOpen}
        onOpenChange={setIsCustomMediaModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Media</DialogTitle>
          </DialogHeader>
          <CustomMediaForm
            loading={isLoading}
            error={undefined}
            onSave={(data, id) => {
              setIsCustomMediaModalOpen(false);
              // For new media, the id will be passed as second parameter
              form.setValue('mediaSlug', id);
              form.setFocus('activityType');
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityMediaSelect;
