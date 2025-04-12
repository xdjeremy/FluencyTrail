import type { FindCustomMediaQuery } from 'types/graphql';

import type { AvailableRoutes } from '@redwoodjs/router';

import type { MetadataValue } from 'src/components/common/MetadataTable';

export type CustomMediaMetadata = Record<string, MetadataValue>;

export type CustomMediaWithMetadata = NonNullable<
  FindCustomMediaQuery['customMedia']
> & {
  metadata: CustomMediaMetadata;
  media?: {
    id: string;
    title: string;
  };
};

export interface CustomMediaDetailProps {
  customMedia: CustomMediaWithMetadata;
}

export interface CustomMediaRoutes extends AvailableRoutes {
  customMedias: () => string;
  customMedia: (args: { id: string }) => string;
  editCustomMedia: (args: { id: string }) => string;
  newCustomMedia: () => string;
}
