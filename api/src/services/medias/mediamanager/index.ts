import type { Prisma } from '@prisma/client';

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
    user?: {
      id: number;
      name: string | null;
    };
  }): MediaResultDto {
    const result: MediaResultDto = {
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
      releaseDate: media.releaseDate,
      date: media.releaseDate, // Backward compatibility
    };

    if (media.user) {
      result.user = {
        id: media.user.id,
        name: media.user.name || undefined,
      };
    }

    return result;
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
    // First try to find in Media table
    const existingMedia = await db.media.findUnique({
      where: { slug },
      include: {
        MovieMetadata: true,
        TvMetadata: true,
      },
    });

    if (existingMedia) {
      // Check if media needs refresh
      if (this.isMediaExpired(existingMedia)) {
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
      return this.mapMediaToDto(existingMedia);
    }

    // If not found in Media table, try CustomMedia
    const customMedia = await db.customMedia.findUnique({
      where: { slug },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (customMedia) {
      return {
        id: customMedia.id,
        title: customMedia.title,
        mediaType: 'CUSTOM',
        slug: customMedia.slug,
        externalId: null,
        originalTitle: null,
        description: null,
        posterUrl: null,
        backdropUrl: null,
        popularity: null,
        date: null,
        user: customMedia.User,
      };
    }

    // If not found anywhere, try fetching from TMDB
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

  private async updateMediaWithMetadata(
    mediaId: string,
    data: {
      title: string;
      mediaType: 'MOVIE' | 'TV';
      originalTitle?: string;
      description?: string;
      posterUrl?: string;
      backdropUrl?: string;
      popularity?: number;
      releaseDate?: Date;
      metadata?: {
        adult?: boolean;
        originalLanguage?: string;
        genres?: string[];
        runtime?: number;
        firstAirDate?: Date;
        lastAirDate?: Date;
        numberOfSeasons?: number;
        numberOfEpisodes?: number;
        status?: string;
        originalCountry?: string[];
      };
    }
  ): Promise<{
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
  }> {
    return db.$transaction(async tx => {
      const updatedMedia = await tx.media.update({
        where: { id: mediaId },
        data: {
          title: data.title,
          mediaType: data.mediaType,
          originalTitle: data.originalTitle,
          description: data.description,
          posterUrl: data.posterUrl,
          backdropUrl: data.backdropUrl,
          popularity: data.popularity,
          releaseDate: data.releaseDate,
          lastSyncedAt: new Date(),
        },
      });

      if (data.metadata) {
        if (data.mediaType === 'MOVIE') {
          await tx.movieMetadata.upsert({
            where: { mediaId },
            create: {
              mediaId,
              adult: data.metadata.adult,
              originalLanguage: data.metadata.originalLanguage,
              genres: data.metadata.genres || [],
              runtime: data.metadata.runtime,
              rawData: data.metadata as unknown as Prisma.JsonValue,
            },
            update: {
              adult: data.metadata.adult,
              originalLanguage: data.metadata.originalLanguage,
              genres: data.metadata.genres || [],
              runtime: data.metadata.runtime,
              rawData: data.metadata as unknown as Prisma.JsonValue,
            },
          });
        } else if (data.mediaType === 'TV') {
          await tx.tvMetadata.upsert({
            where: { mediaId },
            create: {
              mediaId,
              adult: data.metadata.adult,
              originalLanguage: data.metadata.originalLanguage,
              genres: data.metadata.genres || [],
              firstAirDate: data.metadata.firstAirDate,
              lastAirDate: data.metadata.lastAirDate,
              numberOfSeasons: data.metadata.numberOfSeasons,
              numberOfEpisodes: data.metadata.numberOfEpisodes,
              status: data.metadata.status,
              originalCountry: data.metadata.originalCountry || [],
              rawData: data.metadata as unknown as Prisma.JsonValue,
            },
            update: {
              adult: data.metadata.adult,
              originalLanguage: data.metadata.originalLanguage,
              genres: data.metadata.genres || [],
              firstAirDate: data.metadata.firstAirDate,
              lastAirDate: data.metadata.lastAirDate,
              numberOfSeasons: data.metadata.numberOfSeasons,
              numberOfEpisodes: data.metadata.numberOfEpisodes,
              status: data.metadata.status,
              originalCountry: data.metadata.originalCountry || [],
              rawData: data.metadata as unknown as Prisma.JsonValue,
            },
          });
        }
      }

      return updatedMedia;
    });
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
