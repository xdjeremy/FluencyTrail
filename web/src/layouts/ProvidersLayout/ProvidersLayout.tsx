import { Toaster } from 'src/components/ui/toaster';

type ProviderLayoutProps = {
  children?: React.ReactNode;
};

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default ProviderLayout;
