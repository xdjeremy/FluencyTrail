import { Metadata } from '@redwoodjs/web';

import ActivitiesCell from 'src/components/Activity/ActivitiesCell';
import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

const ActivityPage = () => {
  const { setActivityModalOpen } = useActivityModal();
  return (
    <>
      <Metadata title="Activities" description="Activity page" />

      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
              <p className="text-muted-foreground">
                View and manage your language learning activities
              </p>
            </div>
            <Button onClick={() => setActivityModalOpen(true)}>
              <span className="hidden md:inline">Add Activity</span>
              <span className="inline md:hidden">+</span>
            </Button>
          </div>

          {/* <ActivityFilters filters={filters} setFilters={setFilters} /> */}

          <ActivitiesCell itemsPerPage={10} />
        </div>
      </div>
    </>
  );
};

export default ActivityPage;
