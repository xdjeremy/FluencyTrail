import { GetHeatMap, GetHeatMapVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import {
  HeatMapCard,
  HeatMapEmpty,
  HeatMapError,
  HeatMapLoading,
} from './HeatMapCard';

export const QUERY: TypedDocumentNode<GetHeatMap, GetHeatMapVariables> = gql`
  query GetHeatMap {
    heatMap: heatMap {
      count
      date
    }
  }
`;

export const Loading = () => <HeatMapLoading />;

export const Empty = () => <HeatMapEmpty />;

export const Failure = ({ error }: CellFailureProps<GetHeatMapVariables>) => (
  <HeatMapError error={error} />
);

export const Success = ({
  heatMap,
}: CellSuccessProps<GetHeatMap, GetHeatMapVariables>) => {
  return <HeatMapCard heatMap={heatMap} />;
};
