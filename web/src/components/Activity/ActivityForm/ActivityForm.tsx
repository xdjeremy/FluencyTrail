import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  Save,
} from 'lucide-react';
import type {
  ActivityType,
  CreateActivityInput,
  CreateActivityMutation,
  Language, // Import Language type directly if needed
} from 'types/graphql';

import {
  Form,
  SubmitHandler,
  useForm,
  type RWGqlError,
} from '@redwoodjs/forms';

import { useAuth } from 'src/auth';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'; // Import Select components
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
  // Pass user languages and primary language ID as props
  userLanguages?: Pick<Language, 'id' | 'name'>[]; // Use Pick for specific fields
  primaryLanguageId?: number;
}

const ActivityForm = ({
  userLanguages = [], // Default to empty array
  primaryLanguageId,
  ...props
}: ActivityFormProps) => {
  const { isActivityModalOpen, setActivityModalOpen } = useActivityModal();
  const { currentUser } = useAuth();

  const form = useForm<ActivitySchemaType>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      notes: '',
      activityType: 'WATCHING',
      date: new Date(),
      duration: 15,
      mediaSlug: '',
      languageId: primaryLanguageId || undefined, // Set default language
    },
  });

  // Update the date with timezone when currentUser is available
  useEffect(() => {
    if (currentUser?.timezone) {
      const zonedDate = toZonedTime(new Date(), currentUser.timezone);
      form.setValue('date', zonedDate);
    }
  }, [currentUser, form]);

  const onSubmit: SubmitHandler<ActivitySchemaType> = data => {
    // Create a new object with the correct type, casting activityType and formatting date
    // Format the date as 'yyyy-MM-dd' string before sending
    const formattedDate = format(data.date, 'yyyy-MM-dd');

    const saveData: CreateActivityInput = {
      activityType: data.activityType as ActivityType,
      notes: data.notes,
      duration: Number(data.duration),
      date: formattedDate,
      mediaSlug: data.mediaSlug,
      languageId: Number(data.languageId), // Ensure languageId is a number
    };
    props.onSave(saveData);
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
                          disabled={props.loading}
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
                          date >
                            toZonedTime(new Date(), currentUser.timezone) ||
                          date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ActivityMediaSelect isLoading={props.loading} />
            {/* Language Select Field */}
            <FormField
              control={form.control}
              name="languageId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Language*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()} // Convert number to string for Select
                    disabled={props.loading || !userLanguages.length}
                  >
                    <FormControl className="col-span-3">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userLanguages.map(lang => (
                        <SelectItem key={lang.id} value={lang.id.toString()}>
                          {lang.name}
                        </SelectItem>
                      ))}
                      {!userLanguages.length && (
                        <div className="text-muted-foreground p-2 text-sm">
                          No languages added yet. Go to Settings to add one.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          disabled={props.loading}
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
                    <Input type="number" {...field} disabled={props.loading} />
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
                      disabled={props.loading}
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
              disabled={props.loading}
            >
              {props.loading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1 h-4 w-4" />
              )}
              Save Activity
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
