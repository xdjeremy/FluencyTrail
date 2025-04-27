import Header from 'src/components/Header/Header';
import Onboarding from 'src/components/Onboarding/Onboarding';
import QuickAddButton from 'src/components/QuickAdd/QuickAddButton';

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
      {/* <NewActivity /> */}
      <QuickAddButton />
    </>
  );
};

export default BaseLayout;
