import { ArrowLeft } from 'lucide-react';

import { back } from '@redwoodjs/router';

import MediaCell from 'src/components/Media/MediaCell';

interface MediaPageProps {
  slug: string;
}

const MediaPage = ({ slug }: MediaPageProps) => {
  return (
    <>
      <div>
        <button
          onClick={back}
          type="button"
          className="mb-6 inline-flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <MediaCell slug={slug} />
      </div>
    </>
  );
};

export default MediaPage;
