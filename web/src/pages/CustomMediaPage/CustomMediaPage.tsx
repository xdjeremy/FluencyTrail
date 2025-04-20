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

        {/* <Card className="border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search media by title..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>
        <CustomMediaList
          mediaItems={filteredItems}
          onEdit={setEditingMedia}
          onDelete={setDeletingMedia}
        /> */}
      </div>
    </>
  );
};

export default CustomMediaPage;
