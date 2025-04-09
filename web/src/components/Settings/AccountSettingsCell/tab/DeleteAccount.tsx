import { useState } from 'react';

import { Loader2, Trash2 } from 'lucide-react';
import { DeleteUser, DeleteUserVariables } from 'types/graphql';

import { navigate, routes } from '@redwoodjs/router';
import { TypedDocumentNode, useMutation } from '@redwoodjs/web';

import { useAuth } from 'src/auth';
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
import { Button } from 'src/components/ui/button';
import { FormErrorMessage } from 'src/components/ui/form';

const DELETE_USER_MUTATION: TypedDocumentNode<DeleteUser, DeleteUserVariables> =
  gql`
    mutation DeleteUser {
      deleteUser {
        id
      }
    }
  `;

const DeleteAccount = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { reauthenticate } = useAuth();

  const [deleteUser, { loading, error }] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      reauthenticate();
      navigate(routes.login());
    },
    onError: () => {},
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Delete Account</h3>
        <p className="text-muted-foreground text-sm">
          Permanently delete your account and all of your data.
        </p>
      </div>
      <FormErrorMessage error={error} />

      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
        <p className="text-sm">
          Warning: This action cannot be undone. Once you delete your account,
          all of your data will be permanently removed from our servers.
        </p>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all of your data from our servers, including:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Your profile information</li>
                <li>Your learning progress and statistics</li>
                <li>Your activity history and streaks</li>
                <li>Your saved content and preferences</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser()}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccount;
