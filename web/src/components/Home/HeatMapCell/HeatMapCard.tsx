import HeatMap, { HeatMapValue } from '@uiw/react-heat-map';
import { format, subYears } from 'date-fns';
import { GetHeatMap, GetHeatMapVariables } from 'types/graphql';

import { CellFailureProps, CellSuccessProps } from '@redwoodjs/web';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';
import { Skeleton } from 'src/components/ui/skeleton';

const HeatMapCard = ({
  heatMap,
}: CellSuccessProps<GetHeatMap, GetHeatMapVariables>) => {
  const formattedHeatMap: HeatMapValue[] = heatMap.map(item => ({
    date: format(new Date(item.date), 'yyyy/MM/dd'), // Format the date to YYYY/MM/DD
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <HeatMap
          value={formattedHeatMap} // Use the formatted data
          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          startDate={subYears(new Date(), 1)} // Set start date to one year ago
          endDate={new Date()}
          className="w-full"
          rectSize={14}
          panelColors={{
            0: '#f4f4f4',
            15: '#e0f2fe',
            30: '#bae6fd',
            60: '#7dd3fc',
            90: '#0ea5e9',
          }}
        />
      </CardContent>
    </Card>
  );
};

const HeatMapLoading = () => (
  <Card className="h-[220px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg">Activity Heatmap</CardTitle>
    </CardHeader>
    <CardContent className="px-10">
      <Skeleton className="mt-3 h-32 w-full rounded-none" />
    </CardContent>
  </Card>
);

const HeatMapEmpty = () => (
  <Card className="h-[220px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg">Activity Heatmap</CardTitle>
    </CardHeader>
    <CardContent>
      <HeatMap
        value={[]} // Use the formatted data
        weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
        startDate={subYears(new Date(), 1)} // Set start date to one year ago
        endDate={new Date()}
        className="w-full"
        rectSize={14}
        panelColors={{
          0: '#f4f4f4',
          15: '#e0f2fe',
          30: '#bae6fd',
          60: '#7dd3fc',
          90: '#0ea5e9',
        }}
      />
    </CardContent>
  </Card>
);

const HeatMapError = ({ error }: CellFailureProps<GetHeatMapVariables>) => (
  <Card className="h-[220px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg">Activity Heatmap</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-destructive">{error.message}</p>
    </CardContent>
  </Card>
);

export { HeatMapCard, HeatMapEmpty, HeatMapError, HeatMapLoading };
