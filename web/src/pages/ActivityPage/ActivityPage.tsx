import { Metadata } from '@redwoodjs/web';

import ActivitiesCell from 'src/components/Activity/ActivitiesCell';
import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

const ActivityPage = () => {
  const { setActivityModalOpen } = useActivityModal();
  return (
    <>
      <Metadata title="Activities" description="Activity page" />

      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Activities</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              View and manage your language learning activities
            </p>
          </div>
          <Button onClick={() => setActivityModalOpen(true)}>
            <span className="hidden md:inline">Add Activity</span>
            <span className="inline md:hidden">+</span>
          </Button>
        </section>

        {/* Note: I had to put this in a different component so it can access the context provider */}
        <ActivitiesCell itemsPerPage={10} />
      </div>
    </>
  );
};

export default ActivityPage;
