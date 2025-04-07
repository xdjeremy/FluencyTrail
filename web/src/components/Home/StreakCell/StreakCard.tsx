import { Flame, Trophy } from 'lucide-react';
import { GetStreakQuery, GetStreakQueryVariables } from 'types/graphql';

import { CellFailureProps, CellSuccessProps } from '@redwoodjs/web';

import { Card, CardContent } from 'src/components/ui/card';

const StreakCard = ({
  streak,
  completedToday,
}: CellSuccessProps<GetStreakQuery, GetStreakQueryVariables>) => {
  return (
    <Card className="bg-brand-50 dark:bg-brand-50">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex h-14 w-14 items-center justify-center rounded-full">
                <Flame className="h-7 w-7" />
              </div>
              {completedToday && (
                <div className="border-brand-50 dark:border-brand-950 absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-green-500">
                  <span className="sr-only">Completed today</span>
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-800">
                Current Streak
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-brand-700 dark:text-brand-300 text-3xl font-bold">
                  {streak.currentStreak}
                </p>
                <p className="text-brand-600 dark:text-brand-400 text-sm">
                  days
                </p>
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-700">
                {completedToday
                  ? "You've completed your goal for today!"
                  : "Complete today's goal to continue your streak"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-800">
                Best Streak
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-brand-700 dark:text-brand-300 text-xl font-bold">
                {streak.bestStreak}
              </p>
              <p className="text-brand-600 dark:text-brand-400 text-sm">days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StreakCardLoading = () => (
  <Card className="bg-brand-50 dark:bg-brand-50 h-[108px]">
    <CardContent className="p-0"></CardContent>
  </Card>
);

const StreakCardEmpty = () => (
  <Card className="bg-brand-50 dark:bg-brand-50 h-[108px]">
    <CardContent className="p-0"></CardContent>
  </Card>
);

const StreakCardFailure = ({
  error,
}: CellFailureProps<GetStreakQueryVariables>) => (
  <Card className="bg-brand-50 dark:bg-brand-50 h-[108px]">
    <CardContent className="py-2">
      <p className="text-destructive teext-sm">{error.message}</p>
    </CardContent>
  </Card>
);

export { StreakCard, StreakCardEmpty, StreakCardFailure, StreakCardLoading };
