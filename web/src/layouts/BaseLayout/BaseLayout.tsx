import Header from 'src/components/Header/Header';

type BaseLayoutProps = {
  children?: React.ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default BaseLayout;
