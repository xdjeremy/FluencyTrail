import type { MediaType } from 'types/graphql';

import TheMovieDb from '../themoviedb';
import { TmdbMultiSearchResult } from '../themoviedb/interfaces';

import { MediaFetcher, MediaMapper, MediaResultDto } from './interfaces';

export class TmdbMapper implements MediaMapper<TmdbMultiSearchResult> {
  map(source: TmdbMultiSearchResult): MediaResultDto {
    const isMovie = source.media_type === 'movie';
    const mediaType = isMovie ? 'MOVIE' : 'TV';

    return {
      id: `tmdb-${source.id}`,
      externalId: source.id.toString(),
      slug: `tmdb-${mediaType.toLowerCase()}-${source.id}`,
      title: isMovie ? source.title : source.name,
      mediaType: mediaType as MediaType,
      originalTitle: isMovie ? source.original_title : source.original_name,
      description: source.overview,
      posterUrl: source.poster_path
        ? `https://image.tmdb.org/t/p/w500${source.poster_path}`
        : undefined,
      backdropUrl: source.backdrop_path
        ? `https://image.tmdb.org/t/p/original${source.backdrop_path}`
        : undefined,
      popularity: source.popularity,
      date: isMovie
        ? source.release_date
          ? new Date(source.release_date)
          : undefined
        : source.first_air_date
          ? new Date(source.first_air_date)
          : undefined,
    };
  }
}

export class TmdbFetcher implements MediaFetcher {
  private mapper: TmdbMapper;

  constructor(private client: TheMovieDb) {
    this.mapper = new TmdbMapper();
  }

  async fetchById(
    id: string,
    mediaType: MediaType
  ): Promise<MediaResultDto | null> {
    try {
      let response;
      if (mediaType === 'MOVIE') {
        response = await this.client.getMovie({ movieId: parseInt(id) });
      } else {
        response = await this.client.getTv({ tvId: parseInt(id) });
      }
      return this.mapper.map({
        ...response,
        media_type: mediaType === 'MOVIE' ? 'movie' : 'tv',
      });
    } catch (error) {
      console.error(`[TmdbFetcher] Error fetching by ID: ${error.message}`);
      return null;
    }
  }

  async fetchBySlug(slug: string): Promise<MediaResultDto | null> {
    try {
      // Implement search logic based on slug - might need to parse mediaType from slug
      const mediaType = slug.startsWith('tmdb-movie-') ? 'MOVIE' : 'TV';
      const idMatch = slug.match(/tmdb-(movie|tv)-(\d+)/);
      if (!idMatch) return null;

      const id = idMatch[2];
      return this.fetchById(id, mediaType);
    } catch (error) {
      console.error(`[TmdbFetcher] Error fetching by slug: ${error.message}`);
      return null;
    }
  }

  async fetch(query: string): Promise<MediaResultDto[]> {
    try {
      const response = await this.client.searchMulti({ query });
      return response.results
        .filter(
          result => result.media_type === 'movie' || result.media_type === 'tv'
        )
        .map(result => this.mapper.map(result))
        .slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error(`[TmdbFetcher] Error fetching results: ${error.message}`);
      return [];
    }
  }
}
