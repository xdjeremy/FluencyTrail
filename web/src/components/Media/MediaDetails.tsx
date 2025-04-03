import { formatDate } from 'date-fns';
import { Book, Calendar, Eye, Film, Tv } from 'lucide-react';
import { FindMediaQuery, MediaType } from 'types/graphql';

import { imgProxy } from 'src/utils/img-proxy';

import { Button } from '../ui/button';

const MediaDetails = ({ media }: FindMediaQuery) => {
  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'MOVIE':
        return <Film className="h-5 w-5" />;
      case 'TV':
        return <Tv className="h-5 w-5" />;
      case 'BOOK':
        return <Book className="h-5 w-5" />;
    }
  };

  const getMediaTypeLabel = (type: MediaType) => {
    switch (type) {
      case 'MOVIE':
        return 'Movie';
      case 'TV':
        return 'TV Series';
      case 'BOOK':
        return 'Book';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
          <img
            // src={media.coverImage || '/placeholder.svg'}
            // alt={media.title}
            src={imgProxy({
              url: media.posterUrl,
              width: 608,
              height: 912,
              fit: 'cover',
            })}
            alt="placeholder"
            className="object-cover"
          />
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="text-highlight-500 h-5 w-5" />
              <span className="font-medium">{media.popularity}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(new Date(media.releaseDate || ''), 'MMMM dd, yyyy')}
              </span>
            </div>
          </div>

          {media.originalTitle && media.originalTitle !== media.title && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <span>Original Title: {media.originalTitle}</span>
            </div>
          )}
          {media.MovieMetadata?.originalLanguage && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <span>
                Original Language: {media.MovieMetadata.originalLanguage}
              </span>
            </div>
          )}
          {/* {renderMediaDetails()} */}

          <Button className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 w-full text-white dark:text-neutral-900">
            Mark as Watched <Eye className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-10 w-10 items-center justify-center rounded-full">
            {getMediaIcon(media.mediaType)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{media.title}</h1>
            <p className="pl-1 text-neutral-600 dark:text-neutral-400">
              {getMediaTypeLabel(media.mediaType)}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {media.MovieMetadata?.genres.map(genre => (
            <span
              key={genre}
              className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-sm font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert mb-8 max-w-none">
          <h2 className="mb-4 text-xl font-semibold">Overview</h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            {media.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Cast</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {/* {media.cast.map(actor => (
              <div
                key={actor}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-2 h-16 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <Image
                    src={`/placeholder.svg?height=64&width=64`}
                    alt={actor}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{actor}</span>
              </div>
            ))} */}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Similar Media</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* {findSimilarMedia(media).map(item => (
              <Link href={`/media/${item.id}`} key={item.id} className="group">
                <div className="group-hover:border-brand-500 dark:group-hover:border-brand-400 relative aspect-[2/3] overflow-hidden rounded-lg border border-neutral-200 transition-all duration-200 dark:border-neutral-800">
                  <Image
                    src={item.coverImage || '/placeholder.svg'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="mb-1 flex items-center gap-1.5">
                      <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-6 w-6 items-center justify-center rounded-full">
                        {getMediaIcon(item.type)}
                      </div>
                      <span className="text-xs text-white">
                        {getMediaTypeLabel(item.type)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-white">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.genre.slice(0, 2).map(genre => (
                        <span
                          key={genre}
                          className="inline-flex items-center rounded-full bg-neutral-800/80 px-1.5 py-0.5 text-[10px] font-medium text-neutral-200"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;
