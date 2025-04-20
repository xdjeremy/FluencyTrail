// import { Link, routes } from '@redwoodjs/router'

import { Metadata } from '@redwoodjs/web';

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
          {/* <CustomMediaCreateButton onClick={() => setIsCreateModalOpen(true)} /> */}
        </section>

        {/* TODO: add cell */}
      </div>
    </>
  );
};

export default CustomMediaPage;
