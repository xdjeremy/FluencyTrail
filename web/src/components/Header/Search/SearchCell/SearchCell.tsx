import { Loader2 } from 'lucide-react';
import { SearchMediaByQuery, SearchMediaByQueryVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import { Result } from '../Results';

export const QUERY: TypedDocumentNode<
  SearchMediaByQuery,
  SearchMediaByQueryVariables
> = gql`
  query SearchMediaByQuery($query: String!) {
    medias: medias(query: $query) {
      id
      title
      description
      releaseDate
      mediaType
      originalTitle
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
  medias,
}: CellSuccessProps<SearchMediaByQuery, SearchMediaByQueryVariables>) => {
  return (
    <div className="max-h-[60vh] overflow-y-auto py-2">
      {medias.map((item, index) => {
        return (
          <Result key={item.id} index={index} selectedIndex={1} media={item} />
        );
      })}
    </div>
  );
};
