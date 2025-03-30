import { ActivityType } from '@prisma/client';
import {
  Form,
  NumberField,
  SubmitHandler,
  useForm,
  type RWGqlError,
} from '@redwoodjs/forms';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, Save } from 'lucide-react';
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
import { Input, inputVariants } from 'src/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/ui/popover';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';
import { formatPrismaEnum } from 'src/lib/formatters';
import { cn } from 'src/utils/cn';
import type { EditActivityById, UpdateActivityInput } from 'types/graphql';

type FormActivity = NonNullable<EditActivityById['activity']>;

interface ActivityFormProps {
  activity?: EditActivityById['activity'];
  onSave: (data: UpdateActivityInput, id?: FormActivity['id']) => void;
  error: RWGqlError;
  loading: boolean;
}

const ActivityForm = (props: ActivityFormProps) => {
  const { isActivityModalOpen, setActivityModalOpen } = useActivityModal();

  const form = useForm<FormActivity>({
    defaultValues: {
      notes: '',
      activityType: 'WATCHING',
      date: new Date().toISOString(),
      duration: 15,
    },
  });

  const onSubmit: SubmitHandler<FormActivity> = data => {
    props.onSave(data, props?.activity?.id);
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
                            'col-span-3 justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? formatPrismaEnum(ActivityType).find(
                                activity => activity.value === field.value
                              )?.label
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
                            {formatPrismaEnum(ActivityType).map(activity => (
                              <CommandItem
                                value={activity.value}
                                key={activity.value}
                                onSelect={() => {
                                  form.setValue('activityType', activity.value);
                                }}
                              >
                                {activity.label}
                                <Check
                                  className={cn(
                                    'ml-auto size-4',
                                    activity.value === field.value
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
                    <NumberField className={cn(inputVariants())} {...field} />
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
