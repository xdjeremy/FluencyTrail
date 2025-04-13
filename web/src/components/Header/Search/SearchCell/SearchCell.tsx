/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
// Using 'any' as workaround for type generation issue
// import { SearchMyContent, SearchMyContentVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import { Result } from '../Results';
import { useSearchNavigation } from '../useSearchNavigation';

// Update the query to use searchMyContent
export const QUERY: TypedDocumentNode<any, any> = gql`
  query SearchMyContentForHeader($query: String!) {
    # Rename the result field for clarity if desired, or keep as searchMyContent
    results: searchMyContent(query: $query) {
      id
      title
      slug
      mediaType
      posterUrl
      releaseDate # This is DateTime
    }
  }
`;

export const Loading = () => (
  <div className="flex h-full items-center justify-center py-12">
    <Loader2 className="text-brand-600 animate-spin" />
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => (
  <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
    <p>No results found</p>
    <p className="mt-1 text-sm">Try searching for a different term</p>
  </div>
);

export const Failure = (
  { error }: CellFailureProps<any> // Use 'any'
) => (
  <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
    <p>Something went wrong</p>
    <p className="mt-1 text-sm">{error.message}</p>
  </div>
);

// Update props for Success component
export const Success = ({ results }: CellSuccessProps<any, any>) => {
  // Use 'any'
  const { selectedIndex, setSelectedIndex, open, handleSelect } =
    useSearchNavigation();

  // Navigate results with arrow keys
  useHotkeys(
    'arrowdown',
    e => {
      e.preventDefault();
      if (results.length) {
        // Use results.length
        setSelectedIndex((selectedIndex + 1) % results.length); // Use results.length
      }
    },
    { enableOnFormTags: true, enabled: open }
  );

  useHotkeys(
    'arrowup',
    e => {
      e.preventDefault();
      if (results.length) {
        // Use results.length
        setSelectedIndex((selectedIndex - 1 + results.length) % results.length); // Use results.length
      }
    },
    { enableOnFormTags: true, enabled: open }
  );

  // Select result with enter
  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      if (results.length && open) {
        // Use results.length
        // Pass the correct slug from the selected result
        handleSelect({ slug: results[selectedIndex].slug });
      }
    },
    { enableOnFormTags: true, enabled: open }
  );

  // Map over the results array
  return (
    <div className="max-h-[60vh] overflow-y-auto py-2">
      {results.map((item, index) => {
        // Prepare the media prop for the Result component
        const mediaProp = {
          ...item,
          // Format releaseDate if it exists, otherwise pass null/undefined
          releaseDate: item.releaseDate
            ? new Date(item.releaseDate).toISOString().split('T')[0] // Format as YYYY-MM-DD string
            : null,
          // Add description and originalTitle as null/undefined if needed by Result
          description: null, // Not available in SearchResultItem
          originalTitle: null, // Not available in SearchResultItem
        };
        return (
          <Result
            key={item.id}
            index={index}
            selectedIndex={selectedIndex}
            media={mediaProp} // Pass the prepared prop
          />
        );
      })}
    </div>
  );
};
