import { ThemeProvider } from 'next-themes';

import { Toaster } from 'src/components/ui/toaster';

import { ActivityProvider } from './Providers/ActivityProvider';

type ProviderLayoutProps = {
  children?: React.ReactNode;
};

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute={'class'} defaultTheme="system" enableSystem>
        <ActivityProvider>
          {children}
          <Toaster />
        </ActivityProvider>
      </ThemeProvider>
    </>
  );
};

export default ProviderLayout;
