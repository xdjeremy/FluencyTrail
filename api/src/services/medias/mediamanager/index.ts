import type { Prisma } from '@prisma/client';

import { db } from 'src/lib/db';

import TheMovieDb from '../themoviedb';

import { CustomMediaFetcher } from './custom-media-adapter';
import { MediaResultDto } from './interfaces';
import { TmdbFetcher } from './tmdb-adapter';

class MediaManager {
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
  private tmdbFetcher: TmdbFetcher; // For database operations
  private displayFetcher: TmdbFetcher; // For search/similar results
  private customMediaFetcher: CustomMediaFetcher;
  private tmdbClient: TheMovieDb;

  constructor(tmdbClient?: TheMovieDb) {
    this.tmdbClient = tmdbClient;
    this.tmdbFetcher = new TmdbFetcher(tmdbClient, false); // Database operations
    this.displayFetcher = new TmdbFetcher(tmdbClient, true); // Display-only results
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
          existingMedia.mediaType as 'MOVIE' | 'TV' // Ensure correct type for fetchById
        );
        if (freshData) {
          // Call updateMediaWithMetadata to handle upserting metadata
          const { metadata: freshMetadata, ...freshMediaData } = freshData;
          const updatedMedia = await this.updateMediaWithMetadata(
            existingMedia.id,
            {
              // Assert mediaType and structure metadata accordingly
              ...(freshMediaData as Omit<typeof freshMediaData, 'mediaType'> & {
                mediaType: 'MOVIE' | 'TV';
              }),
              // Map freshMetadata to the expected structure
              metadata: freshMetadata
                ? {
                    adult: freshMetadata.adult ?? undefined,
                    originalLanguage:
                      freshMetadata.original_language ?? undefined,
                    genres:
                      (
                        freshMetadata.genres as unknown as Array<{
                          id: number;
                          name: string;
                        }>
                      )?.map(g => g.name) || [],
                    runtime:
                      freshMediaData.mediaType === 'MOVIE'
                        ? ((freshMetadata.runtime as number) ?? undefined)
                        : undefined,
                    firstAirDate:
                      freshMediaData.mediaType === 'TV' &&
                      typeof freshMetadata.first_air_date === 'string' &&
                      freshMetadata.first_air_date
                        ? new Date(freshMetadata.first_air_date)
                        : undefined,
                    lastAirDate:
                      freshMediaData.mediaType === 'TV' &&
                      typeof freshMetadata.last_air_date === 'string' &&
                      freshMetadata.last_air_date
                        ? new Date(freshMetadata.last_air_date)
                        : undefined,
                    numberOfSeasons:
                      freshMediaData.mediaType === 'TV'
                        ? ((freshMetadata.number_of_seasons as number) ??
                          undefined)
                        : undefined,
                    numberOfEpisodes:
                      freshMediaData.mediaType === 'TV'
                        ? ((freshMetadata.number_of_episodes as number) ??
                          undefined)
                        : undefined,
                    status:
                      freshMediaData.mediaType === 'TV'
                        ? ((freshMetadata.status as string) ?? undefined)
                        : undefined,
                    originalCountry:
                      freshMediaData.mediaType === 'TV'
                        ? ((freshMetadata.origin_country as string[]) ?? [])
                        : undefined,
                  }
                : undefined,
            }
          );
          // Fetch again to include relations for the DTO mapping
          const mediaWithRelations = await db.media.findUnique({
            where: { id: updatedMedia.id },
            include: { MovieMetadata: true, TvMetadata: true },
          });
          return mediaWithRelations
            ? this.mapMediaToDto(mediaWithRelations)
            : null;
        }
      }
      return this.mapMediaToDto(existingMedia);
    }

    // If not found in Media table, try CustomMedia
    const customMedia = await db.customMedia.findUnique({
      where: { slug, userId: context.currentUser.id },
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
    const newMediaDto = await this.tmdbFetcher.fetchBySlug(slug);
    if (newMediaDto) {
      const { metadata, ...mediaData } = newMediaDto; // Separate metadata

      // Use a transaction with upsert to handle concurrent media creation atomically
      const createdMediaWithMetadata = await db.$transaction(async tx => {
        // 1. Upsert the Media record using externalId + mediaType as unique key
        const { id: _id, ...mediaDataWithoutId } = mediaData;
        const createdMedia = await tx.media.upsert({
          where: {
            externalId_mediaType: {
              externalId: mediaDataWithoutId.externalId,
              mediaType: mediaDataWithoutId.mediaType,
            },
          },
          create: {
            ...mediaDataWithoutId,
            lastSyncedAt: new Date(),
          },
          update: {
            ...mediaDataWithoutId,
            lastSyncedAt: new Date(),
          },
        });

        // 2. Create the Metadata record if applicable
        if (metadata) {
          if (newMediaDto.mediaType === 'MOVIE') {
            const metadataFields = {
              mediaId: createdMedia.id,
              adult: metadata.adult ?? undefined,
              originalLanguage: metadata.original_language ?? undefined,
              genres:
                (
                  metadata.genres as unknown as Array<{
                    id: number;
                    name: string;
                  }>
                )?.map(g => g.name) || [],
              runtime: (metadata.runtime as number) ?? undefined,
              rawData: metadata as unknown as Prisma.JsonValue,
            };
            await tx.movieMetadata.upsert({
              where: { mediaId: createdMedia.id },
              create: metadataFields,
              update: metadataFields,
            });
          } else if (newMediaDto.mediaType === 'TV') {
            const tvMetadataFields = {
              mediaId: createdMedia.id,
              adult: metadata.adult ?? undefined,
              originalLanguage: metadata.original_language ?? undefined,
              genres:
                (
                  metadata.genres as unknown as Array<{
                    id: number;
                    name: string;
                  }>
                )?.map(g => g.name) || [],
              firstAirDate:
                typeof metadata.first_air_date === 'string' &&
                metadata.first_air_date
                  ? new Date(metadata.first_air_date)
                  : undefined,
              lastAirDate:
                typeof metadata.last_air_date === 'string' &&
                metadata.last_air_date
                  ? new Date(metadata.last_air_date)
                  : undefined,
              numberOfSeasons:
                (metadata.number_of_seasons as number) ?? undefined,
              numberOfEpisodes:
                (metadata.number_of_episodes as number) ?? undefined,
              status: (metadata.status as string) ?? undefined,
              originalCountry: (metadata.origin_country as string[]) ?? [],
            };
            await tx.tvMetadata.upsert({
              where: { mediaId: createdMedia.id },
              create: tvMetadataFields,
              update: tvMetadataFields,
            });
          }
        }

        // 3. Fetch the created media again with its relations to return
        // We need to fetch again because the initial create didn't include relations
        return tx.media.findUnique({
          where: { id: createdMedia.id },
          include: { MovieMetadata: true, TvMetadata: true },
        });
      });

      // Map the final result (which should include metadata if created)
      return createdMediaWithMetadata
        ? this.mapMediaToDto(createdMediaWithMetadata)
        : null; // Should not happen if transaction succeeded
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
              // rawData: data.metadata as unknown as Prisma.JsonValue, // Removed due to TS errors
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
              // rawData: data.metadata as unknown as Prisma.JsonValue, // Removed due to TS errors
            },
          });
        }
      }

      return updatedMedia;
    });
  }

  async searchMedias(query: string): Promise<MediaResultDto[]> {
    let retryCount = 0;
    const maxRetries = 3;
    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    while (retryCount < maxRetries) {
      try {
        // Fetch results from both sources concurrently
        const [tmdbResults, customResults] = await Promise.allSettled([
          this.displayFetcher.fetch(query),
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

        // Successful, return results
        return results.slice(0, 10);
      } catch (error) {
        console.error(
          `[MediaManager] Search attempt ${retryCount + 1} failed:`,
          error
        );
        retryCount++;
        if (retryCount === maxRetries) {
          console.error('[MediaManager] Max retries reached, giving up');
          return [];
        }
        // Exponential backoff
        await delay(Math.pow(2, retryCount) * 100);
      }
    }
    return [];
  }

  async getSimilarMedias({
    mediaId,
    mediaType,
  }: {
    mediaId: number;
    mediaType: 'MOVIE' | 'TV';
  }): Promise<MediaResultDto[]> {
    try {
      const results = await this.tmdbClient.getSimilarMedias({
        mediaId,
        mediaType,
        page: 1,
        language: 'en',
      });

      // Use displayFetcher's mapResult method for consistent ID handling
      return results.results.map(result =>
        this.displayFetcher.mapResult({
          ...result,
          media_type: mediaType === 'MOVIE' ? 'movie' : 'tv',
        })
      );
    } catch (error) {
      console.error('[MediaManager] Error fetching similar medias:', error);
      return [];
    }
  }
}

export { MediaManager };
