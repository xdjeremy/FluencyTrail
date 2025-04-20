import NewActivity from 'src/components/Activity/NewActivity/NewActivity';
import Header from 'src/components/Header/Header';
import Onboarding from 'src/components/Onboarding/Onboarding';

type BaseLayoutProps = {
  children?: React.ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-5 py-8 lg:px-20 xl:px-52">
        {children}
      </div>
      <Onboarding />
      <NewActivity />
    </>
  );
};

export default BaseLayout;
