import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useMutation } from '@redwoodjs/web';

import { DropdownMenuItem } from 'src/components/ui/dropdown-menu';

const DELETE_ACTIVITY_MUTATION = gql`
  mutation DeleteActivityForActivityList($id: String!) {
    deleteActivity(id: $id) {
      id
    }
  }
`;

const DeleteActivity = ({ activityId }: { activityId: string }) => {
  const [deleteActivity, { loading }] = useMutation(DELETE_ACTIVITY_MUTATION, {
    onCompleted: () => {
      toast.success('Activity deleted successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
    refetchQueries: ['GetActivitiesForActivityList'],
  });

  return (
    <DropdownMenuItem
      onClick={() =>
        deleteActivity({
          variables: {
            id: activityId,
          },
        })
      }
      className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      Delete
    </DropdownMenuItem>
  );
};

export default DeleteActivity;
