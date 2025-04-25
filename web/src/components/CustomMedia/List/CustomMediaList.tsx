import { formatDate } from 'date-fns';
import { Calendar, MoreHorizontal, Pencil, Popcorn } from 'lucide-react';
import { GetAllCustomMediasQuery } from 'types/graphql';

import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { Card } from 'src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';

import CustomMediaCreateModal from '../Create/CustomMediaCreateModal';
import CustomMediaDelete from '../Delete/CustomMediaDelete';

interface CustomMediaListProps {
  mediaItems: GetAllCustomMediasQuery['customMedia'];
}

const CustomMediaList = ({ mediaItems }: CustomMediaListProps) => {
  return (
    <div className="space-y-4">
      {mediaItems.length > 0 ? (
        mediaItems.map(media => (
          <Card
            key={media.id}
            className="border p-4 transition-colors hover:border-neutral-300 dark:hover:border-neutral-400"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-10 w-10 items-center justify-center rounded-full">
                  <Popcorn className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{media.title}</h3>
                    <Badge variant="outline">
                      {media.Activity.length} Activities
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <Calendar className="mr-1 h-3 w-3" />
                    Added on {formatDate(media.createdAt, 'MMM d, yyyy')}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                  // onClick={() => onEdit(media)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <CustomMediaDelete />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))
      ) : (
        <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
          <p className="mb-2 text-lg font-medium">No custom media found</p>
          <p className="mb-6">
            Add your first custom media item to get started.
          </p>
          <CustomMediaCreateModal />
        </div>
      )}
    </div>
  );
};

export default CustomMediaList;
