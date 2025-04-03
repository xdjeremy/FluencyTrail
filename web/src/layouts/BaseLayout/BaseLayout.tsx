import NewActivity from 'src/components/Activity/NewActivity/NewActivity';
import Header from 'src/components/Header/Header';

type BaseLayoutProps = {
  children?: React.ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-20 py-8">{children}</div>
      <NewActivity />
    </>
  );
};

export default BaseLayout;
