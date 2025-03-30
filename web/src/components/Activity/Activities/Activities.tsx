import type {
  DeleteActivityMutation,
  DeleteActivityMutationVariables,
  FindActivities,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Activity/ActivitiesCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

const DELETE_ACTIVITY_MUTATION: TypedDocumentNode<
  DeleteActivityMutation,
  DeleteActivityMutationVariables
> = gql`
  mutation DeleteActivityMutation($id: String!) {
    deleteActivity(id: $id) {
      id
    }
  }
`

const ActivitiesList = ({ activities }: FindActivities) => {
  const [deleteActivity] = useMutation(DELETE_ACTIVITY_MUTATION, {
    onCompleted: () => {
      toast.success('Activity deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteActivityMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete activity ' + id + '?')) {
      deleteActivity({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Activity type</th>
            <th>Notes</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{truncate(activity.id)}</td>
              <td>{truncate(activity.userId)}</td>
              <td>{formatEnum(activity.activityType)}</td>
              <td>{truncate(activity.notes)}</td>
              <td>{truncate(activity.duration)}</td>
              <td>{timeTag(activity.date)}</td>
              <td>{timeTag(activity.createdAt)}</td>
              <td>{timeTag(activity.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.activity({ id: activity.id })}
                    title={'Show activity ' + activity.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editActivity({ id: activity.id })}
                    title={'Edit activity ' + activity.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete activity ' + activity.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(activity.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActivitiesList
