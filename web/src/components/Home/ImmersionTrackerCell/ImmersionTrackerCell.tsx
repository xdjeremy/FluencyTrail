import type {
  FindImmersionTrackerQuery,
  FindImmersionTrackerQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindImmersionTrackerQuery,
  FindImmersionTrackerQueryVariables
> = gql`
  query FindImmersionTrackerQuery($id: Int!) {
    immersionTracker: immersionTracker(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindImmersionTrackerQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  immersionTracker,
}: CellSuccessProps<
  FindImmersionTrackerQuery,
  FindImmersionTrackerQueryVariables
>) => {
  return <div>{JSON.stringify(immersionTracker)}</div>
}
