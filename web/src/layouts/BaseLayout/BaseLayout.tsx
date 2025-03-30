import NewActivity from 'src/components/Activity/NewActivity/NewActivity';
import Header from 'src/components/Header/Header';

type BaseLayoutProps = {
  children?: React.ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <NewActivity />
    </>
  );
};

export default BaseLayout;
