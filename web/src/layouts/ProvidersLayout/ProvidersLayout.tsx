import { ThemeProvider } from 'next-themes';
import { Toaster } from 'src/components/ui/toaster';

type ProviderLayoutProps = {
  children?: React.ReactNode;
};

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute={'class'} defaultTheme="system" enableSystem>
        <Toaster />
        {children}
      </ThemeProvider>
    </>
  );
};

export default ProviderLayout;
