import { db } from 'src/lib/db';

import TheMovieDb from '../themoviedb';

import { CustomMediaFetcher } from './custom-media-adapter';
import { MediaResultDto } from './interfaces';
import { TmdbFetcher } from './tmdb-adapter';

export class MediaManager {
  private mapMediaToDto(media: {
    id: string;
    externalId: string | null;
    slug: string;
    title: string;
    mediaType: 'MOVIE' | 'TV' | 'BOOK' | 'CUSTOM' | null;
    originalTitle: string | null;
    description: string | null;
    posterUrl: string | null;
    backdropUrl: string | null;
    popularity: number | null;
    releaseDate: Date | null;
  }): MediaResultDto {
    return {
      id: media.id,
      externalId: media.externalId,
      slug: media.slug,
      title: media.title,
      mediaType: media.mediaType,
      originalTitle: media.originalTitle,
      description: media.description,
      posterUrl: media.posterUrl,
      backdropUrl: media.backdropUrl,
      popularity: media.popularity,
      date: media.releaseDate,
    };
  }
  private tmdbFetcher: TmdbFetcher;
  private customMediaFetcher: CustomMediaFetcher;

  constructor(tmdbClient: TheMovieDb) {
    this.tmdbFetcher = new TmdbFetcher(tmdbClient);
    this.customMediaFetcher = new CustomMediaFetcher();
  }

  private isMediaExpired(media: {
    lastSyncedAt?: Date | null;
    ttl?: number | null;
  }): boolean {
    if (!media.lastSyncedAt || !media.ttl) return true;
    const now = new Date();
    const expirationTime = new Date(
      media.lastSyncedAt.getTime() + media.ttl * 1000
    );
    return now > expirationTime;
  }

  async getMediaBySlug(slug: string): Promise<MediaResultDto | null> {
    // First try to find in database
    const existingMedia = await db.media.findUnique({ where: { slug } });

    if (existingMedia) {
      // Skip TTL check for custom media
      if (existingMedia.mediaType === 'CUSTOM') {
        return this.mapMediaToDto(existingMedia);
      }

      // Check if media needs refresh
      if (!this.isMediaExpired(existingMedia)) {
        return this.mapMediaToDto(existingMedia);
      }

      // Fetch fresh data if expired
      const freshData = await this.tmdbFetcher.fetchById(
        existingMedia.externalId,
        existingMedia.mediaType
      );
      if (freshData) {
        const updatedMedia = await db.media.update({
          where: { id: existingMedia.id },
          data: {
            ...freshData,
            lastSyncedAt: new Date(),
          },
        });
        return this.mapMediaToDto(updatedMedia);
      }
    }

    // If not found or couldn't refresh, try fetching from TMDB
    const newMedia = await this.tmdbFetcher.fetchBySlug(slug);
    if (newMedia) {
      const createdMedia = await db.media.create({
        data: {
          ...newMedia,
          lastSyncedAt: new Date(),
        },
      });
      return this.mapMediaToDto(createdMedia);
    }

    return null;
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
