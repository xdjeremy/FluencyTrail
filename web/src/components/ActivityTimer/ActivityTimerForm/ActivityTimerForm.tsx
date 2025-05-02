import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Clock, Loader2 } from 'lucide-react';
import { ActivityType, StartTimerInput } from 'types/graphql';

import { Form, FormError, useForm, type RWGqlError } from '@redwoodjs/forms';

import { activityTypes } from 'src/components/Activity/ActivityForm/constants';
import LanguageSelect from 'src/components/Activity/ActivityForm/fields/LanguageSelect';
import ActivityMediaSelect from 'src/components/Activity/ActivityForm/fields/MediaSelect';
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
  DialogDescription,
  DialogFooter,
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
import { Input } from 'src/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/ui/popover';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';
import { cn } from 'src/utils/cn';

import {
  ActivityTimerSchema,
  ActivityTimerSchemaType,
} from './ActivityTimerSchema';

interface ActivityTimerFormProps {
  onSubmit: (input: StartTimerInput) => void;
  mutationLoading?: boolean;
  error?: RWGqlError;
}

const ActivityTimerForm = ({
  onSubmit,
  mutationLoading,
  error,
}: ActivityTimerFormProps) => {
  const { isActivityTimerModalOpen, setActivityTimerModalOpen } =
    useActivityModal();

  const form = useForm<ActivityTimerSchemaType>({
    resolver: zodResolver(ActivityTimerSchema),
    defaultValues: {
      notes: '',
      activityType: 'WATCHING',
      mediaSlug: '',
    },
  });

  const handleStartTimer = (data: ActivityTimerSchemaType) => {
    const input: StartTimerInput = {
      mediaSlug: data.mediaSlug,
      activityType: data.activityType as ActivityType,
      languageId: data.languageId,
      customMediaTitle: data.customMediaTitle,
    };
    onSubmit(input);
  };

  return (
    <Dialog
      open={isActivityTimerModalOpen}
      onOpenChange={setActivityTimerModalOpen}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Form formMethods={form} onSubmit={handleStartTimer} error={error}>
          <FormError error={error} />
          <DialogHeader>
            <DialogTitle>Set Up Timed Activity</DialogTitle>
            <DialogDescription>
              Enter activity details before starting the timer. Duration will be
              automatically recorded.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <ActivityMediaSelect isLoading={mutationLoading} />
            <LanguageSelect isLoading={mutationLoading} />
            <FormField
              control={form.control}
              name="activityType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Type*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'col-span-3 justify-between lowercase',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={mutationLoading}
                        >
                          {field.value
                            ? activityTypes.find(
                                activity => activity === field.value
                              )
                            : 'Select activity'}
                          <ChevronsUpDown className="size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search activity..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No activity found.</CommandEmpty>
                          <CommandGroup>
                            {activityTypes.map(activity => (
                              <CommandItem
                                value={activity}
                                key={activity}
                                className="lowercase"
                                onSelect={() => {
                                  form.setValue('activityType', activity);
                                }}
                              >
                                {activity}
                                <Check
                                  className={cn(
                                    'ml-auto size-4',
                                    activity === field.value
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Notes</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      placeholder="Optional notes about this activity"
                      disabled={mutationLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActivityTimerModalOpen(false)}
              disabled={mutationLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="gap-2"
              disabled={mutationLoading}
            >
              {mutationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              Start Timer
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityTimerForm;
