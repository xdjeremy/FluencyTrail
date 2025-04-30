import CurrentActivityTimerCell from 'src/components/ActivityTimer/CurrentActivityTimerCell';
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

      {/* Confetti */}
      <span id="rewardId" className="fixed bottom-0 right-1/2" />
      <Onboarding />
      <QuickAddButton />
      <CurrentActivityTimerCell />
    </>
  );
};

export default BaseLayout;
