import React from 'react';

import {
  Book,
  BookOpen,
  Dices,
  Gamepad2,
  Headphones,
  MessageSquareQuote,
  MoreHorizontal,
  Pencil,
  PenIcon,
  TvMinimalPlay,
} from 'lucide-react';
import { ActivityType, GetActivitiesForActivityList } from 'types/graphql';

import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';

import DeleteActivity from './DeleteActivity';

const ActivityList = ({ activities }: GetActivitiesForActivityList) => {
  // group activities by date
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const date = new Date(activity.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    },
    {} as Record<string, typeof activities>
  );

  const activityIcons: Record<ActivityType, React.ReactNode> = {
    READING: <Book className="h-4 w-4" />,
    LISTENING: <Headphones className="h-4 w-4" />,
    VOCABULARY: <MessageSquareQuote className="h-4 w-4" />,
    WRITING: <PenIcon className="h-4 w-4" />,
    GRAMMAR: <BookOpen className="h-4 w-4" />,
    PLAYING: <Gamepad2 className="h-4 w-4" />,
    WATCHING: <TvMinimalPlay className="h-4 w-4" />,
    OTHER: <Dices className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      {Object.keys(groupedActivities).map(date => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {date}
          </h3>
          <div className="space-y-2">
            {groupedActivities[date].map(activity => (
              <div
                key={activity.id}
                className="border border-neutral-200 p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-10 w-10 items-center justify-center rounded-full">
                      {activityIcons[activity.activityType] || (
                        <Book className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium uppercase">
                          {activity.activityType}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.duration} min
                        </Badge>
                      </div>
                      {activity.notes && (
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          {activity.notes}
                        </p>
                      )}
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
                      // onClick={() => handleEditActivity(activity)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DeleteActivity activityId={activity.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
