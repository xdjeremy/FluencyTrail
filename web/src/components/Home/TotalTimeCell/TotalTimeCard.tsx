import { Clock, TrendingUp } from 'lucide-react';
import { GetTotalTimeQuery, GetTotalTimeQueryVariables } from 'types/graphql';

import { CellFailureProps } from '@redwoodjs/web';

import { Card, CardContent } from 'src/components/ui/card';
import { cn } from 'src/utils/cn';

const TotalTimeCard = ({ totalTime }: GetTotalTimeQuery) => {
  // format the total time from minutes to hours and minutes
  const formatMinutesToHoursAndMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  const formattedTime = formatMinutesToHoursAndMinutes(
    Number(totalTime.totalTime)
  );

  const isPositiveChange = Number(totalTime.vsLastWeek) >= 0;

  return (
    <Card className="bg-brand-50 dark:bg-brand-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Clock className="text-brand-600 dark:text-brand-400 h-5 w-5" />
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total Immersion Time
              </h3>
            </div>
            <p className="text-brand-700 dark:text-brand-300 text-3xl font-bold">
              {formattedTime}
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm">
              <TrendingUp
                className={cn(
                  isPositiveChange ? 'text-green-500' : 'text-red-500',
                  'h-4 w-4'
                )}
              />
              <span
                className={
                  isPositiveChange
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }
              >
                {isPositiveChange ? '+' : ''}
                {totalTime.vsLastWeek}%
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                vs. last week
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TotalTimeCardLoading = () => (
  <Card className="bg-brand-50 dark:bg-brand-50 h-[108px]"></Card>
);

const TotalTimeCardEmpty = () => (
  <Card className="bg-brand-50 dark:bg-brand-50">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Clock className="text-brand-600 dark:text-brand-400 h-5 w-5" />
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Total Immersion Time
            </h3>
          </div>
          <p className="text-brand-700 dark:text-brand-300 text-3xl font-bold">
            0h 0m
          </p>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <TrendingUp className={cn('text-green-500', 'h-4 w-4')} />
            <span className={'text-green-600 dark:text-green-400'}>+ 0%</span>
            <span className="text-neutral-500 dark:text-neutral-400">
              vs. last week
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TotalTimeCardError = ({
  error,
}: CellFailureProps<GetTotalTimeQueryVariables>) => (
  <Card className="bg-brand-50 dark:bg-brand-50 h-[108px]">
    <CardContent className="p-4">
      <p className="text-destructive text-sm">{error.message}</p>
    </CardContent>
  </Card>
);

export {
  TotalTimeCard,
  TotalTimeCardEmpty,
  TotalTimeCardError,
  TotalTimeCardLoading,
};
