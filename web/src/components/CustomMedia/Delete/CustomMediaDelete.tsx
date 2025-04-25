import React, { useState } from 'react';

import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'src/components/ui/alert-dialog';
import { DropdownMenuItem } from 'src/components/ui/dropdown-menu';

const CustomMediaDelete = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild={true}>
        <DropdownMenuItem
          // onClick={() => onDelete(media)}
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
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
            {/* Are you sure you want to delete "{media.title}"? This action cannot */}
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel> */}
          <AlertDialogAction
            // onClick={e => {
            //   e.preventDefault();
            //   handleDelete();
            // }}
            // disabled={isDeleting}
            className="focußs:ring-red-600 bg-red-600 text-white hover:bg-red-700"
          >
            {/* {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )} */}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomMediaDelete;
