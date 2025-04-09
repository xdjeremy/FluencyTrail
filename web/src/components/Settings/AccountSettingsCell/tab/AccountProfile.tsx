import { zodResolver } from '@hookform/resolvers/zod';
import initials from 'initials';
import { Loader2, Save } from 'lucide-react';
import { FindUserForProfileSettings } from 'types/graphql';

import { Form, useForm } from '@redwoodjs/forms';

import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar';
import { Button } from 'src/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';

import {
  ProfileFormSchema,
  ProfileFormSchemaType,
} from './AccountSettingsSchema';

const AccountProfile = ({ user }: FindUserForProfileSettings) => {
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const isUpdating = false;
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

      <Form formMethods={form} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isUpdating} />
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
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default AccountProfile;
