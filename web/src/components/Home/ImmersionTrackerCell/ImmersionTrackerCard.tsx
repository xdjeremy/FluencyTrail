import {
  Book,
  BookOpen,
  Dices,
  Gamepad2,
  Headphones,
  MessageSquareQuote,
  PenIcon,
  TvMinimalPlay,
} from 'lucide-react';
import { ActivityType, FindActivitiesForRecentActivities } from 'types/graphql';

const ImmersionTrackerCard = ({
  activities,
}: FindActivitiesForRecentActivities) => {
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
    <div className="space-y-4">
      {Object.keys(groupedActivities).map(date => (
        <div key={date} className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h4>
          <div className="space-y-2">
            {groupedActivities[date].map(activity => (
              <div
                key={activity.id}
                className="bg-background flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-8 w-8 items-center justify-center rounded-full">
                    {activityIcons[activity.activityType] || (
                      <Book className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.activityType}
                      {/* {activityLabels[activity.type] || activity.type} */}
                    </p>
                    {activity.notes && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium">
                  {activity.duration} min
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ImmersionCardLoading = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
    <div className="space-y-2">
      <div className="h-6 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-6 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  </div>
);

const ImmersionCardEmpty = () => (
  <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">
    <p>
      No activities recorded yet. Start tracking your immersion practice! 8==D
    </p>
  </div>
);

const ImmersionCardError = ({ error }: { error?: string }) => (
  <div className="text-destructive py-8 text-center">
    <p>{error ? error : 'Error loading activities. Please try again later.'}</p>
  </div>
);
export {
  ImmersionTrackerCard,
  ImmersionCardLoading,
  ImmersionCardEmpty,
  ImmersionCardError,
};
