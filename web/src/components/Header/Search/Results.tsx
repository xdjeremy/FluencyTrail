import { Book, Film, Tv } from 'lucide-react';
import { MediaType, SearchMediaByQuery } from 'types/graphql';

import { cn } from 'src/utils/cn';

export const Result = ({
  selectedIndex,
  index,
  media,
}: {
  selectedIndex: number;
  index: number;
  media: SearchMediaByQuery['medias'][number];
}) => {
  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'MOVIE':
        return <Film className="h-4 w-4" />;
      case 'TV':
        return <Tv className="h-4 w-4" />;
      case 'BOOK':
        return <Book className="h-4 w-4" />;
    }
  };
  return (
    <button
      // onClick={() => handleSelect(item)}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-2 text-left',
        index === selectedIndex
          ? 'bg-brand-50 dark:bg-brand-950'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'
      )}
    >
      <div className="mt-1 flex-shrink-0">
        <div
          className={`rounded-md p-2 ${
            index === selectedIndex
              ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
        >
          {getMediaIcon(media.mediaType)}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="truncate text-sm font-medium">{media.title}</h4>
          <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
            {media.releaseDate.split('-')[0]}
          </span>
        </div>
        {media.originalTitle && media.originalTitle !== media.title && (
          <p className="text-brand-600 dark:text-brand-400 mt-0.5 text-xs">
            {media.originalTitle}{' '}
            {/* {item.originalLanguage && `(${item.originalLanguage})`} */}
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
          {media.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {/* {item.genre.slice(0, 3).map(genre => (
            <span
              key={genre}
              className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {genre}
            </span>
          ))} */}
        </div>
      </div>
    </button>
  );
};
