import { Loader2 } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { SearchMediaByQuery, SearchMediaByQueryVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import { Result } from '../Results';
import { useSearchNavigation } from '../useSearchNavigation';

export const QUERY: TypedDocumentNode<
  SearchMediaByQuery,
  SearchMediaByQueryVariables
> = gql`
  query SearchMediaByQuery($query: String!) {
    searchMedias: searchMedias(query: $query) {
      id
      title
      description
      date
      mediaType
      originalTitle
      slug
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

export const Failure = ({
  error,
}: CellFailureProps<SearchMediaByQueryVariables>) => (
  <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
    <p>Something went wrong</p>
    <p className="mt-1 text-sm">{error.message}</p>
  </div>
);

export const Success = ({
  searchMedias,
}: CellSuccessProps<SearchMediaByQuery, SearchMediaByQueryVariables>) => {
  const { selectedIndex, setSelectedIndex, open, handleSelect } =
    useSearchNavigation();

  // Navigate results with arrow keys
  useHotkeys(
    'arrowdown',
    e => {
      e.preventDefault();
      if (searchMedias.length) {
        setSelectedIndex((selectedIndex + 1) % searchMedias.length);
      }
    },
    { enableOnFormTags: true, enabled: open }
  );

  useHotkeys(
    'arrowup',
    e => {
      e.preventDefault();
      if (searchMedias.length) {
        setSelectedIndex(
          (selectedIndex - 1 + searchMedias.length) % searchMedias.length
        );
      }
    },
    { enableOnFormTags: true, enabled: open }
  );

  // Select result with enter
  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      if (searchMedias.length && open) {
        handleSelect({ slug: searchMedias[selectedIndex].slug });
      }
    },
    { enableOnFormTags: true, enabled: open }
  );

  return (
    <div className="max-h-[60vh] overflow-y-auto py-2">
      {searchMedias.map((item, index) => {
        return (
          <Result
            key={item.id}
            index={index}
            selectedIndex={selectedIndex}
            media={item}
          />
        );
      })}
    </div>
  );
};
