import cacheManager from 'src/lib/api/cache';
import ExternalAPI from 'src/lib/api/externalapi';
import { TmdbSearchMultiResponse } from './interfaces';

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
    } catch (e) {
      return {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };
    }
  };
}

export default TheMovieDb;
