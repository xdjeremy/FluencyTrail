import { Metadata } from '@redwoodjs/web';

import HeatMapCell from 'src/components/Home/HeatMapCell';
import { HomeProvider } from 'src/components/Home/HomeProvider';
import ImmersionTrackerCell from 'src/components/Home/ImmersionTrackerCell';
import LanguageSelectorCell from 'src/components/Home/LanguageSelectorCell';
import StreakCell from 'src/components/Home/StreakCell';
import TotalTimeCell from 'src/components/Home/TotalTimeCell';

const HomePage = () => {
  return (
    <HomeProvider>
      <Metadata title="Home" description="Home page" />

      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Learning Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your language learning progress
            </p>
          </div>
          <LanguageSelectorCell />
        </section>

        {/* Activity Heatmap - Central element */}
        <section>
          <HeatMapCell />
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <StreakCell />
          <TotalTimeCell />
        </div>

        <section className="rounded-lg border bg-white p-6 dark:bg-neutral-950">
          <ImmersionTrackerCell />
        </section>
      </div>
    </HomeProvider>
  );
};

export default HomePage;
