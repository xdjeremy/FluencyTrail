import { MediaType } from 'types/graphql';

import cacheManager from 'src/lib/api/cache';
import ExternalAPI from 'src/lib/api/externalapi';

import {
  TmdbMovieDetails,
  TmdbSearchMovieResponse,
  TmdbSearchMultiResponse,
  TmdbSearchTvResponse,
  TmdbTvDetails, // Added TV Details interface import
} from './interfaces';

interface SearchOptions {
  query: string;
  page?: number;
  includeAdult?: boolean;
  language?: string;
}

class TheMovieDb extends ExternalAPI {
  private region?: string;
  private originalLanguage?: string;
  constructor({
    region,
    originalLanguage,
  }: { region?: string; originalLanguage?: string } = {}) {
    super(
      'https://api.themoviedb.org/3',
      {
        api_key: process.env.TMDB_API_KEY,
      },
      {
        nodeCache: cacheManager.getCache('tmdb').data,
        rateLimit: {
          maxRequests: 20,
          maxRPS: 50,
        },
      }
    );
    this.region = region;
    this.originalLanguage = originalLanguage;
  }

  public searchMulti = async ({
    query,
    page = 1,
    includeAdult = false,
    language = 'en',
  }: SearchOptions): Promise<TmdbSearchMultiResponse> => {
    try {
      const data = await this.get<TmdbSearchMultiResponse>('/search/multi', {
        params: {
          query,
          page,
          include_adult: includeAdult,
          language,
        },
      });

      return data;
    } catch {
      return {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };
    }
  };

  public getMovie = async ({
    movieId,
    language = 'en',
  }: {
    movieId: number;
    language?: string;
  }): Promise<TmdbMovieDetails> => {
    try {
      const data = await this.get<TmdbMovieDetails>(
        `/movie/${movieId}`,
        {
          params: {
            language,
            append_to_response:
              'credits,external_ids,videos,keywords,release_dates,watch/providers',
            include_video_language: language + ', en',
          },
        },
        43200
      );

      return data;
    } catch (e) {
      throw new Error(`[TMDB] Failed to fetch movie details: ${e.message}`);
    }
  };

  public getTv = async ({
    tvId,
    language = 'en',
  }: {
    tvId: number;
    language?: string;
  }): Promise<TmdbTvDetails> => {
    try {
      const data = await this.get<TmdbTvDetails>(
        `/tv/${tvId}`,
        {
          params: {
            language,
            // Added common append_to_response params for TV
            append_to_response:
              'credits,external_ids,videos,keywords,content_ratings,watch/providers',
            include_video_language: language + ', en',
          },
        },
        43200 // Using the same cache duration as movies for now (12 hours)
      );
      return data;
    } catch (e) {
      throw new Error(`[TMDB] Failed to fetch TV details: ${e.message}`);
    }
  };

  private async getMovieSimilar({
    movieId,
    page = 1,
    language = 'en',
  }: {
    movieId: number;
    page?: number;
    language?: string;
  }): Promise<TmdbSearchMovieResponse> {
    try {
      const data = await this.get<TmdbSearchMovieResponse>(
        `/movie/${movieId}/similar`,
        {
          params: {
            page,
            language,
          },
        }
      );

      // Append media_type to all results
      const processedData = {
        ...data,
        results: data.results.map(movie => ({
          ...movie,
          media_type: 'movie' as const,
        })),
      };
      return processedData;
    } catch (e) {
      throw new Error(`[TMDB] Failed to fetch discover movies: ${e.message}`);
    }
  }

  private async getTvSimilar({
    tvId,
    page = 1,
    language = 'en',
  }: {
    tvId: number;
    page?: number;
    language?: string;
  }): Promise<TmdbSearchTvResponse> {
    try {
      const data = await this.get<TmdbSearchTvResponse>(`/tv/${tvId}/similar`, {
        params: {
          page,
          language,
        },
      });

      // Append media_type to all results
      const processedData = {
        ...data,
        results: data.results.map(movie => ({
          ...movie,
          media_type: 'tv' as const,
        })),
      };
      return processedData;
    } catch (e) {
      throw new Error(`[TMDB] Failed to fetch TV similar: ${e.message}`);
    }
  }

  public async getSimilarMedias({
    mediaId,
    mediaType,
    page = 1,
    language = 'en',
  }: {
    mediaId: number;
    mediaType: MediaType;
    page?: number;
    language?: string;
  }): Promise<TmdbSearchTvResponse | TmdbSearchMovieResponse> {
    try {
      if (mediaType === 'MOVIE') {
        return await this.getMovieSimilar({
          movieId: mediaId,
          page,
          language,
        });
      } else if (mediaType === 'TV') {
        return await this.getTvSimilar({
          tvId: mediaId,
          page,
          language,
        });
      } else {
        throw new Error('Unsupported media type');
      }
    } catch (e) {
      throw new Error(`[TMDB] Failed to fetch similar media: ${e.message}`);
    }
  }
}

export default TheMovieDb;
