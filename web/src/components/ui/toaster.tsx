'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-neutral-500',
          actionButton:
            'group-[.toast]:bg-foreground group-[.toast]:text-neutral-100',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-neutral-500',
        },
      }}
      {...props}
    />
  );
};
Toaster.displayName = 'Toaster';

export { Toaster };
