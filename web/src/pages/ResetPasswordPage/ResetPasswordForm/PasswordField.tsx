import { FC, useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { useFormContext } from '@redwoodjs/forms';

import { PasswordStrengthIndicator } from 'src/components/common/PasswordStrengthIndicator';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';

import { ResetPasswordSchemaType } from './ResetPasswordSchema';

interface PasswordFieldProps {
  isLoading: boolean;
}

const ResetPasswordField: FC<PasswordFieldProps> = ({ isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();

  const password = form.watch('password');
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>New Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                {...field}
                className="h-11 border-neutral-200 pr-10 dark:border-neutral-800"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
          </FormControl>
          <PasswordStrengthIndicator password={password} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
const ResetConfirmPasswordField: FC<PasswordFieldProps> = ({ isLoading }) => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useFormContext<ResetPasswordSchemaType>();
  return (
    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm New Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                {...field}
                className="h-11 border-neutral-200 pr-10 dark:border-neutral-800"
                disabled={isLoading}
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
  );
};

export { ResetConfirmPasswordField, ResetPasswordField };
