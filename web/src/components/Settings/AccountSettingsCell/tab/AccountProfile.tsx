import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import initials from 'initials';
import { Check, ChevronsUpDown, Command, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
  FindUserForProfileSettings,
} from 'types/graphql';

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms';
import { TypedDocumentNode } from '@redwoodjs/web';

import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar';
import { Button } from 'src/components/ui/button';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'src/components/ui/command';
import {
  FormControl,
  FormDescription,
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
import { cn } from 'src/utils/cn';

import {
  ProfileFormSchema,
  ProfileFormSchemaType,
} from './AccountSettingsSchema';

const EDIT_PROFILE_MUTATION: TypedDocumentNode<
  EditProfileMutation,
  EditProfileMutationVariables
> = gql`
  mutation EditProfileMutation($input: EditUserInput!) {
    editUser(input: $input) {
      name
      timezone
    }
  }
`;

const AccountProfile = ({ user }: FindUserForProfileSettings) => {
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      timezone: user.timezone,
    },
  });

  const [editProfile, { loading, error }] = useMutation(EDIT_PROFILE_MUTATION, {
    onCompleted: () => {
      toast.success('Profile updated successfully');
    },
  });

  const onSave: SubmitHandler<ProfileFormSchemaType> = input => {
    editProfile({
      variables: {
        input: {
          name: input.name,
          timezone: input.timezone,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback className="text-lg">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-sm font-medium">Profile Picture</h4>
          <p className="text-muted-foreground text-sm">
            This will be displayed on your profile and in comments.
          </p>
          {/* <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div> */}
        </div>
      </div>

      <Form formMethods={form} onSubmit={onSave} className="space-y-6">
        <FormErrorMessage error={error} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormDescription>
                This is your full name. It will be visible to other users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={true} />
              </FormControl>
              <FormDescription>
                This is the email associated with your account. We&apos;ll use
                this to contact you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FIXME: Error when opening popover */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Timezone</FormLabel>
              <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={timezoneOpen}
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={loading}
                    >
                      {field.value
                        ? timezones.find(tz => tz.value === field.value)?.label
                        : 'Select timezone...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search timezone..." />
                    <CommandList>
                      <CommandEmpty>No timezone found.</CommandEmpty>
                      <CommandGroup>
                        {timezones.map(tz => (
                          <CommandItem
                            value={tz.label} // Use label for searching
                            key={tz.value}
                            onSelect={() => {
                              field.onChange(tz.value);
                              setTimezoneOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                tz.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {tz.label}
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
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default AccountProfile;

// Get timezone list - consider memoizing if performance becomes an issue
const timezones = Intl.supportedValuesOf('timeZone').map(tz => ({
  value: tz,
  label: tz.replace(/_/g, ' '), // Replace underscores for better readability
}));
