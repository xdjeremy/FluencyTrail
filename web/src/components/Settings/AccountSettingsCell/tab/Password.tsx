import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  UpdateUserPasswordMutation,
  UpdateUserPasswordMutationVariables,
} from 'types/graphql';

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms';
import { TypedDocumentNode, useMutation } from '@redwoodjs/web';

import { PasswordStrengthIndicator } from 'src/components/common/PasswordStrengthIndicator';
import { Button } from 'src/components/ui/button';
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
  PasswordFormSchema,
  PasswordFormSchemaType,
} from './AccountSettingsSchema';

const CHANGE_PASSWORD_MUTATION: TypedDocumentNode<
  UpdateUserPasswordMutation,
  UpdateUserPasswordMutationVariables
> = gql`
  mutation UpdateUserPasswordMutation($input: UpdateUserPasswordInput!) {
    updateUserPassword(input: $input) {
      id
    }
  }
`;

const Password = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormSchemaType>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [changePassword, { loading, error }] = useMutation(
    CHANGE_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        form.reset();
        toast.success('Password changed successfully');
      },
    }
  );

  const onSave: SubmitHandler<PasswordFormSchemaType> = ({ newPassword }) => {
    changePassword({
      variables: {
        input: {
          password: newPassword,
        },
      },
    });
  };

  // Watcher for the password strength indicator
  const newPassword = form.watch('newPassword');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-muted-foreground text-sm">
          Update your password to keep your account secure.
        </p>
      </div>

      <Form onSubmit={onSave} formMethods={form} className="space-y-6">
        <FormErrorMessage error={error} />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showNewPassword ? 'text' : 'password'}
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showNewPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
              </FormControl>
              <PasswordStrengthIndicator password={newPassword} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading || !form.formState.isValid}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Change Password
        </Button>
      </Form>
    </div>
  );
};

export default Password;
