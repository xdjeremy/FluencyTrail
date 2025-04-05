import { useEffect, useState } from 'react';

import { Check, X } from 'lucide-react';

import { Progress } from '../ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
  showCriteria?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showCriteria = true,
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  useEffect(() => {
    // Check password criteria
    const newCriteria = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };

    setCriteria(newCriteria);

    // Calculate strength (0-5)
    const newStrength = Object.values(newCriteria).filter(Boolean).length;
    setStrength(newStrength);
  }, [password]);

  const getStrengthText = () => {
    if (!password) return '';
    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (!password) return 'bg-neutral-200 dark:bg-neutral-700';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-green-500';
    return 'bg-brand-600 dark:bg-brand-400';
  };

  const getStrengthTextColor = () => {
    if (!password) return 'text-neutral-500 dark:text-neutral-400';
    if (strength === 1) return 'text-red-500';
    if (strength === 2) return 'text-yellow-500';
    if (strength === 3) return 'text-green-500';
    return 'text-brand-600 dark:text-brand-400';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500 dark:text-neutral-400">
            Password strength:
          </span>
          <span className={getStrengthTextColor()}>{getStrengthText()}</span>
        </div>
        <Progress
          value={(strength / 4) * 100}
          className="h-1.5 bg-neutral-200 dark:bg-neutral-700"
          indicatorClassName={getStrengthColor()}
        />
      </div>

      {showCriteria && (
        <div className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            {criteria.hasMinLength ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-neutral-400" />
            )}
            <span
              className={
                criteria.hasMinLength
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }
            >
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {criteria.hasUppercase ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-neutral-400" />
            )}
            <span
              className={
                criteria.hasUppercase
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }
            >
              One uppercase letter
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {criteria.hasLowercase ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-neutral-400" />
            )}
            <span
              className={
                criteria.hasLowercase
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }
            >
              One lowercase letter
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {criteria.hasNumber ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-neutral-400" />
            )}
            <span
              className={
                criteria.hasNumber
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }
            >
              One number
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
