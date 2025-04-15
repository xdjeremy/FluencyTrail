import type { MediaType } from 'types/graphql';

export interface MediaFetcher {
  fetch(query: string): Promise<MediaResultDto[]>;
}

export interface MediaMapper<T> {
  map(source: T): MediaResultDto;
}

export interface MediaResultDto {
  id: string;
  externalId?: string;
  slug: string;
  title: string;
  mediaType: MediaType;
  originalTitle?: string;
  description?: string;
  posterUrl?: string;
  backdropUrl?: string;
  popularity?: number;
  date?: Date; // Combined date field for release_date/first_air_date
}
