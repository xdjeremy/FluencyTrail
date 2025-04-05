import { FC, ReactNode } from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { cn } from 'src/utils/cn';

import { Alert, AlertDescription } from '../ui/alert';

const messageVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-neutral-50 dark:bg-neutral-800/50',
      success:
        'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30',
      destructive:
        'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30',
    },
    icon: {
      default: 'text-neutral-600 dark:text-neutral-400',
      success: 'h-4 w-4 text-green-600 dark:text-green-400',
      destructive: 'h-4 w-4 text-red-600 dark:text-red-400',
    },
  },
  defaultVariants: {
    icon: 'default',
    variant: 'default',
  },
});

interface MessageProps {
  variant?: VariantProps<typeof messageVariants>['variant'];
  icon?: VariantProps<typeof messageVariants>['icon'];
  textClassName?: string;
  children?: ReactNode;
}

const renderIcon = (iconType: VariantProps<typeof messageVariants>['icon']) => {
  switch (iconType) {
    case 'default':
      return;
    case 'success':
      return <CheckCircle2 className={messageVariants({ icon: 'success' })} />;
    case 'destructive':
      return (
        <AlertCircle className={messageVariants({ icon: 'destructive' })} />
      );
  }
};

const Message: FC<MessageProps> = ({
  icon,
  variant,
  textClassName,
  children,
}) => {
  return (
    <Alert className={cn(messageVariants({ variant }))}>
      {renderIcon(icon)}
      <AlertDescription className={cn(textClassName)}>
        {children}
      </AlertDescription>
    </Alert>
  );
};

export default Message;
