import { SearchMediaByQuery, SearchMediaByQueryVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

export const QUERY: TypedDocumentNode<
  SearchMediaByQuery,
  SearchMediaByQueryVariables
> = gql`
  query SearchMediaByQuery($query: String!) {
    medias: medias(query: $query) {
      id
      title
      description
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<SearchMediaByQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  medias,
}: CellSuccessProps<SearchMediaByQuery, SearchMediaByQueryVariables>) => {
  return (
    <ul>
      {medias.map(item => {
        return <li key={item.id}>{JSON.stringify(item)}</li>;
      })}
    </ul>
  );
};
