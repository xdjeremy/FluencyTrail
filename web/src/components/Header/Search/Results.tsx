import { Book, FileQuestion, Film, Tv } from 'lucide-react';
// Import the correct types - assuming SearchMyContent will be the new query type
// We'll update the component props later when modifying SearchCell
import { MediaType, SearchResultItem } from 'types/graphql';

import { cn } from 'src/utils/cn';

import { useSearchNavigation } from './useSearchNavigation';

// Define props based on SearchResultItem
interface ResultProps {
  selectedIndex: number;
  index: number;
  media: SearchResultItem; // Use the unified search result type
}

export const Result = ({ selectedIndex, index, media }: ResultProps) => {
  // Get handleSelect from the hook
  const { handleSelect } = useSearchNavigation();

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'MOVIE':
        return <Film className="h-4 w-4" />;
      case 'TV':
        return <Tv className="h-4 w-4" />;
      case 'BOOK':
        return <Book className="h-4 w-4" />;
      case 'CUSTOM': // Handle CUSTOM type
        return <FileQuestion className="h-4 w-4" />; // Or choose a different icon
      default: {
        // Fallback for any unexpected types
        const exhaustiveCheck: never = type;
        console.warn(`Unexpected media type: ${exhaustiveCheck}`);
        return <FileQuestion className="h-4 w-4" />;
      }
    }
  };

  // Format release date safely
  const releaseYear = media.releaseDate
    ? new Date(media.releaseDate).getFullYear()
    : null;

  return (
    <button
      // Navigate using the slug (which is CustomMedia ID for custom items)
      onClick={() => {
        handleSelect({
          slug: media.slug,
          // Pass mediaType if needed for navigation logic later
          // mediaType: media.mediaType
        });
      }}
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
          {/* Conditionally display release year */}
          {releaseYear && !isNaN(releaseYear) && (
            <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
              {releaseYear}
            </span>
          )}
        </div>
        {/* originalTitle and description are not part of SearchResultItem, remove or adapt if needed */}
        {/* {media.originalTitle && media.originalTitle !== media.title && ( ... )} */}
        {/* {media.description && ( ... )} */}
        <div className="mt-1 flex flex-wrap gap-1">
          {/* Genre display logic would need adaptation if added to SearchResultItem */}
        </div>
      </div>
    </button> // Correct closing tag
  );
};
