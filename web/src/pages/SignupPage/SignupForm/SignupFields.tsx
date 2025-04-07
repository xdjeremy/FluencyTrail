import { useState } from 'react';

import { Check, ChevronsUpDown, Eye, EyeOff } from 'lucide-react';

import { useFormContext } from '@redwoodjs/forms';
import { Link } from '@redwoodjs/router';

import { PasswordStrengthIndicator } from 'src/components/common/PasswordStrengthIndicator';
import { Button } from 'src/components/ui/button';
import { Checkbox } from 'src/components/ui/checkbox';
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
  FormDescription,
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

interface SignupFieldsProps {
  isLoading: boolean;
}

export const SignupNameField = ({ isLoading }: SignupFieldsProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter your name"
              {...field}
              className="h-11"
              disabled={isLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const SignupEmailField = ({ isLoading }: SignupFieldsProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="you@example.com"
              {...field}
              className="h-11"
              disabled={isLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const SignupPasswordField = ({ isLoading }: SignupFieldsProps) => {
  const form = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const password = form.watch('password');

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>

          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...field}
                className="h-11"
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

export const SignupConfirmPasswordField = ({
  isLoading,
}: SignupFieldsProps) => {
  const form = useFormContext();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...field}
                className="h-11"
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

export const SignupTermsField = ({ isLoading }: SignupFieldsProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="terms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-medium leading-none">
              I agree to the{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                target="_blank"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Privacy Policy
              </Link>
            </FormLabel>
            <FormDescription className="text-xs">
              We&apos;ll never share your information with third parties.
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

// Get timezone list - consider memoizing if performance becomes an issue
const timezones = Intl.supportedValuesOf('timeZone').map(tz => ({
  value: tz,
  label: tz.replace(/_/g, ' '), // Replace underscores for better readability
}));

export const SignupTimezoneField = ({ isLoading }: SignupFieldsProps) => {
  const [open, setOpen] = useState(false);
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="timezone"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Timezone</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
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
                          setOpen(false);
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
  );
};
