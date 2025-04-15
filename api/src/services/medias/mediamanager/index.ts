import TheMovieDb from '../themoviedb';

import { CustomMediaFetcher } from './custom-media-adapter';
import { MediaResultDto } from './interfaces';
import { TmdbFetcher } from './tmdb-adapter';

export class MediaManager {
  private tmdbFetcher: TmdbFetcher;
  private customMediaFetcher: CustomMediaFetcher;

  constructor(tmdbClient: TheMovieDb) {
    this.tmdbFetcher = new TmdbFetcher(tmdbClient);
    this.customMediaFetcher = new CustomMediaFetcher();
  }

  async searchMedias(query: string): Promise<MediaResultDto[]> {
    try {
      // Fetch results from both sources concurrently
      const [tmdbResults, customResults] = await Promise.allSettled([
        this.tmdbFetcher.fetch(query),
        this.customMediaFetcher.fetch(query),
      ]);

      // Combine successful results
      const results: MediaResultDto[] = [];

      // Add CustomMedia results first (priority)
      if (customResults.status === 'fulfilled') {
        results.push(...customResults.value);
      }

      // Add TMDB results
      if (tmdbResults.status === 'fulfilled') {
        results.push(...tmdbResults.value);
      }

      // Limit to 10 results total
      return results.slice(0, 10);
    } catch (error) {
      console.error('[MediaManager] Error searching medias:', error);
      return [];
    }
  }
}

export default MediaManager;
