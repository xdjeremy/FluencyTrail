// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web';

import HeatMapCell from 'src/components/Home/HeatMapCell';

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Learning Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your language learning progress
            </p>
          </div>
          {/* <LanguageSelector
          languages={languages}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        /> */}
        </section>

        {/* Activity Heatmap - Central element */}
        <section>
          <HeatMapCell />
        </section>
      </div>
    </>
  );
};

export default HomePage;
