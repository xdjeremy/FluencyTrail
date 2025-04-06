import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, Save } from 'lucide-react';
import type {
  ActivityType, // <-- Import ActivityType enum
  CreateActivityInput,
  CreateActivityMutation,
} from 'types/graphql';

import {
  Form,
  SubmitHandler,
  useForm,
  type RWGqlError,
} from '@redwoodjs/forms';

import { Button } from 'src/components/ui/button';
import { Calendar } from 'src/components/ui/calendar';
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
  FormErrorMessage,
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

import { ActivitySchema, ActivitySchemaType } from './ActivitySchema';
import { activityTypes } from './constants';
import ActivityMediaSelect from './fields/MediaSelect';

interface ActivityFormProps {
  activity?: CreateActivityMutation['createActivity'];
  onSave: (data: CreateActivityInput) => void;
  error: RWGqlError;
  loading: boolean;
}

const ActivityForm = (props: ActivityFormProps) => {
  const { isActivityModalOpen, setActivityModalOpen } = useActivityModal();

  const form = useForm<ActivitySchemaType>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      notes: '',
      activityType: 'WATCHING',
      date: new Date(),
      duration: 15,
      mediaSlug: '',
    },
  });

  // TODO: add loading state

  const onSubmit: SubmitHandler<ActivitySchemaType> = data => {
    // Create a new object with the correct type, casting activityType and formatting date
    const saveData: CreateActivityInput = {
      ...data,
      activityType: data.activityType as ActivityType, // <-- Explicit cast
      date: data.date.toISOString(), // <-- Convert Date to ISO string
      duration: Number(data.duration), // <-- Explicitly convert duration to number
    };
    props.onSave(saveData); // <-- Use the correctly typed object
  };

  return (
    <Dialog open={isActivityModalOpen} onOpenChange={setActivityModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            Record your language immersion activities to track your progress.
          </DialogDescription>
        </DialogHeader>

        <Form formMethods={form} onSubmit={onSubmit} error={props.error}>
          <FormErrorMessage error={props.error} />
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'col-span-3',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ActivityMediaSelect />
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
                                  form.setFocus('duration');
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
              name="duration"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Duration* (min)</FormLabel>
                  <FormControl className="col-span-3">
                    <Input type="number" {...field} />
                    {/* <Input placeholder="15" type="number" {...field} /> */}
                  </FormControl>
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
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-white dark:text-neutral-900"
            >
              <Save className="mr-1 h-4 w-4" /> Save Activity
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
