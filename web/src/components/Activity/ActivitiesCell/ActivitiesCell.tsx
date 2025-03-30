import type { FindActivities, FindActivitiesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Activities from 'src/components/Activity/Activities'

export const QUERY: TypedDocumentNode<FindActivities, FindActivitiesVariables> =
  gql`
    query FindActivities {
      activities {
        id
        userId
        activityType
        notes
        duration
        date
        createdAt
        updatedAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No activities yet.{' '}
      <Link to={routes.newActivity()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindActivities>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  activities,
}: CellSuccessProps<FindActivities, FindActivitiesVariables>) => {
  return <Activities activities={activities} />
}
