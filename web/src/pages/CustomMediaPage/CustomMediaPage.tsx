import { Metadata } from '@redwoodjs/web';

import CustomMediaCreateModal from 'src/components/CustomMedia/Create/CustomMediaCreateModal';
import CustomMediaCell from 'src/components/CustomMedia/CustomMediaCell';

const CustomMediaPage = () => {
  return (
    <>
      <Metadata title="CustomMedia" description="CustomMedia page" />

      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Custom Media</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Create and manage your custom language learning media
            </p>
          </div>
          <CustomMediaCreateModal />
        </section>

        <CustomMediaCell />
      </div>
    </>
  );
};

export default CustomMediaPage;
