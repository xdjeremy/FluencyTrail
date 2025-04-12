import { Metadata } from '@redwoodjs/web';

import { HomeProvider } from 'src/components/Home/HomeProvider';
import LanguageSelectorCell from 'src/components/Home/LanguageSelectorCell';

import HomeCards from './HomeCards';

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

        {/* Note: I had to put this in a diffent component so it can access the context provider */}
        <HomeCards />
      </div>
    </HomeProvider>
  );
};

export default HomePage;
