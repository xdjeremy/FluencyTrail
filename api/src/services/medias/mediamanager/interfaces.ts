export type MediaTypeEnum = 'MOVIE' | 'TV' | 'BOOK';

export interface MediaResultDto {
  id: string;
  externalId?: string;
  slug: string;
  title: string;
  mediaType: MediaTypeEnum;
  originalTitle?: string;
  description?: string;
  posterUrl?: string;
  backdropUrl?: string;
  popularity?: number;
  releaseDate?: Date;
}

export interface MediaFetcher {
  fetch(query: string): Promise<MediaResultDto[]>;
}

export interface MediaMapper<T> {
  map(source: T): MediaResultDto;
}
