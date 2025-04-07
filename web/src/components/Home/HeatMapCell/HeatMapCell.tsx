import { GetHeatMap, GetHeatMapVariables } from 'types/graphql';

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web';

import HeatMapCard from './HeatMapCard';

export const QUERY: TypedDocumentNode<GetHeatMap, GetHeatMapVariables> = gql`
  query GetHeatMap {
    heatMap: heatMap {
      count
      date
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({ error }: CellFailureProps<GetHeatMapVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  heatMap,
}: CellSuccessProps<GetHeatMap, GetHeatMapVariables>) => {
  return <HeatMapCard heatMap={heatMap} />;
};
