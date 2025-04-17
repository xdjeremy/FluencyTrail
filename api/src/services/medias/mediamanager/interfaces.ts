import type { MediaType } from 'types/graphql';

export interface MediaFetcher {
  fetch(query: string): Promise<MediaResultDto[]>;
}

export interface MediaMapper<T> {
  map(source: T): MediaResultDto;
}

export interface UserDto {
  id: number;
  name?: string;
}

export type MovieRawMetadata = {
  adult?: boolean;
  original_language?: string;
  genres?: string[];
  runtime?: number;
  [key: string]: unknown;
};

export type TvRawMetadata = {
  adult?: boolean;
  original_language?: string;
  genres?: string[];
  first_air_date?: string;
  last_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  origin_country?: string[];
  [key: string]: unknown;
};

export interface MediaResultDto {
  id: string; // Required for GraphQL, use display-only IDs for non-DB results
  externalId?: string;
  slug: string;
  title: string;
  mediaType: MediaType;
  originalTitle?: string;
  description?: string;
  posterUrl?: string;
  backdropUrl?: string;
  popularity?: number;
  releaseDate?: Date; // Matches Prisma schema's releaseDate field
  /** @deprecated Use releaseDate instead */
  date?: Date; // Kept for backward compatibility
  user?: UserDto;
  metadata?: MovieRawMetadata | TvRawMetadata; // Added to hold raw metadata
}
