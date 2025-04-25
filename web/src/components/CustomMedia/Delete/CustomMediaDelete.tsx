import { useState } from 'react';

import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { GetAllCustomMediasQuery } from 'types/graphql';

import { useMutation } from '@redwoodjs/web';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'src/components/ui/alert-dialog';
import { DropdownMenuItem } from 'src/components/ui/dropdown-menu';

const DELETE_MEDIA = gql`
  mutation DeleteCustomMeida($id: String!) {
    deleteCustomMedia(id: $id) {
      id
    }
  }
`;

interface CustomMediaDeleteProps {
  media: GetAllCustomMediasQuery['customMedia'][number];
}

const CustomMediaDelete = ({ media }: CustomMediaDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [mutate, { loading }] = useMutation(DELETE_MEDIA, {
    refetchQueries: ['GetAllCustomMediasQuery'],
    onCompleted: () => {
      toast.success('Custom media deleted successfully');
      setIsOpen(false);
    },
    onError: error => {
      toast.error(`Error deleting custom media: ${error.message}`);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild={true}>
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Custom Media
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{media.title}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              mutate({
                variables: {
                  id: media.id,
                },
              });
            }}
            disabled={loading}
            className="focußs:ring-red-600 bg-red-600 text-white hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{' '}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomMediaDelete;
