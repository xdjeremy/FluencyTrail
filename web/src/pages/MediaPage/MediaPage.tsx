import { ArrowLeft } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

interface MediaPageProps {
  id: string;
}

const MediaPage = ({ id }: MediaPageProps) => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Link
          to={routes.home()}
          className="mb-6 inline-flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        {id}
      </div>
    </>
  );
};

export default MediaPage;
