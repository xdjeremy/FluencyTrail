import HeatMap, { HeatMapValue } from '@uiw/react-heat-map';
import { format, subYears } from 'date-fns';
import { GetHeatMap, GetHeatMapVariables } from 'types/graphql';

import { CellSuccessProps } from '@redwoodjs/web';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';

const HeatMapCard = ({
  heatMap,
}: CellSuccessProps<GetHeatMap, GetHeatMapVariables>) => {
  // Ensure data format matches HeatMap component requirements
  // const formattedHeatMap = heatMap
  //   .filter(
  //     item => item.date && item.count !== null && item.count !== undefined
  //   ) // Filter out items with missing date or count
  //   .map(item => {
  //     // Parse and reformat the date to ensure YYYY/MM/DD format with leading zeros
  //     const dateObj = new Date(item.date!);
  //     const year = dateObj.getFullYear();
  //     const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  //     const day = String(dateObj.getDate()).padStart(2, '0');
  //     const formattedDate = `${year}/${month}/${day}`;

  //     return {
  //       date: formattedDate,
  //       count: item.count!, // Assert non-null as we filtered
  //     };
  //   });

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

export default HeatMapCard;
