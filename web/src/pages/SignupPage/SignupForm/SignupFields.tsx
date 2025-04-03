import { useState } from 'react';

import { Check, Eye, EyeOff, Info } from 'lucide-react';

import { useFormContext } from '@redwoodjs/forms';
import { Link } from '@redwoodjs/router';

import { Checkbox } from 'src/components/ui/checkbox';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/tooltip';

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
              className="h-11 border-neutral-200 dark:border-neutral-800"
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
              className="h-11 border-neutral-200 dark:border-neutral-800"
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
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (hasMinLength) strength += 1;
    if (hasUppercase) strength += 1;
    if (hasLowercase) strength += 1;
    if (hasNumber) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-neutral-200 dark:bg-neutral-700';
    if (passwordStrength === 1) return 'bg-destructive';
    if (passwordStrength === 2) return 'bg-highlight-500';
    if (passwordStrength === 3) return 'bg-green-500';
    return 'bg-brand-600 dark:bg-brand-400';
  };
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Password</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs space-y-2">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-1">
                      <span
                        className={
                          hasMinLength ? 'text-green-500' : 'text-neutral-500'
                        }
                      >
                        {hasMinLength ? <Check className="h-3 w-3" /> : '•'}
                      </span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-1">
                      <span
                        className={
                          hasUppercase ? 'text-green-500' : 'text-neutral-500'
                        }
                      >
                        {hasUppercase ? <Check className="h-3 w-3" /> : '•'}
                      </span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-1">
                      <span
                        className={
                          hasLowercase ? 'text-green-500' : 'text-neutral-500'
                        }
                      >
                        {hasLowercase ? <Check className="h-3 w-3" /> : '•'}
                      </span>
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-1">
                      <span
                        className={
                          hasNumber ? 'text-green-500' : 'text-neutral-500'
                        }
                      >
                        {hasNumber ? <Check className="h-3 w-3" /> : '•'}
                      </span>
                      One number
                    </li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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
          {password && (
            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Password strength:
                </span>
                <span
                  className={
                    passwordStrength === 1
                      ? 'text-red-500'
                      : passwordStrength === 2
                        ? 'text-yellow-500'
                        : passwordStrength === 3
                          ? 'text-green-500'
                          : passwordStrength === 4
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-neutral-500 dark:text-neutral-400'
                  }
                >
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
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

export const SignupTermsField = ({ isLoading }: SignupFieldsProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="terms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
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
