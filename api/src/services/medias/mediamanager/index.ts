import type { CustomMedia } from '@prisma/client';
import { subDays } from 'date-fns';
import { Media, MediaType } from 'types/graphql';

import { db } from 'src/lib/db';

import TheMovieDb from '../themoviedb';

import { mapCustomResult, mapTMDBResults } from './mapresult';

export default class MediaManager {
  private tmdb: TheMovieDb;

  constructor() {
    this.tmdb = new TheMovieDb();
  }

  async getMediaBySlug(slug: string): Promise<Media | null> {
    // First check if we have fresh data in DB
    const existingMedia = await db.media.findFirst({
      where: {
        slug,
        updatedAt: {
          gte: subDays(new Date(), 30), // Updated within last 30 days
        },
      },
    });

    if (existingMedia) {
      return {
        ...existingMedia,
        releaseDate: existingMedia.releaseDate
          ? new Date(existingMedia.releaseDate)
          : null,
      };
    }

    // If no fresh data, fetch from TMDB
    const tmdbId = this.extractTmdbIdFromSlug(slug);
    if (!tmdbId) return null;

    const mediaType = this.getMediaTypeFromSlug(slug);
    return this.createOrUpdateFromTmdb(tmdbId, mediaType);
  }

  async createOrUpdateFromTmdb(
    tmdbId: number,
    mediaType: MediaType
  ): Promise<Media> {
    let mediaData;
    let finalMediaType = mediaType;

    try {
      if (mediaType === 'MOVIE') {
        mediaData = await this.tmdb.getMovie({ movieId: tmdbId });
      } else {
        // For TV or anime, try TV endpoint first
        try {
          mediaData = await this.tmdb.getTv({ tvId: tmdbId });
          finalMediaType = 'TV';
        } catch (e) {
          // If TV fails and it's not explicitly marked as TV, try movie as fallback
          if (mediaType !== 'TV') {
            mediaData = await this.tmdb.getMovie({ movieId: tmdbId });
            finalMediaType = 'MOVIE';
          } else {
            throw e; // Re-throw if explicitly TV and TV endpoint failed
          }
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch media details: ${error.message}. Media type: ${mediaType}, ID: ${tmdbId}`
      );
    }

    const baseMediaData = {
      externalId: tmdbId.toString(),
      title: mediaData.title || mediaData.name,
      slug: this.generateSlug(
        mediaData.title || mediaData.name,
        tmdbId,
        mediaData.type
      ),
      mediaType: finalMediaType.toUpperCase() as 'MOVIE' | 'TV',
      originalTitle: mediaData.original_title || mediaData.original_name,
      description: mediaData.overview,
      posterUrl: mediaData.poster_path
        ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`
        : null,
      backdropUrl: mediaData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${mediaData.backdrop_path}`
        : null,
      popularity: mediaData.popularity,
      releaseDate:
        mediaData.release_date || mediaData.first_air_date
          ? new Date(mediaData.release_date || mediaData.first_air_date)
          : null,
    };

    const movieMetadata = {
      adult: mediaData.adult,
      originalLanguage: mediaData.original_language,
      genres: mediaData.genres?.map(g => g.name) || [],
      runtime: mediaData.runtime,
      rawData: mediaData,
    };

    const tvMetadata = {
      adult: mediaData.adult,
      originalLanguage: mediaData.original_language,
      genres: mediaData.genres?.map(g => g.name) || [],
      firstAirDate: mediaData.first_air_date
        ? new Date(mediaData.first_air_date)
        : null,
      lastAirDate: mediaData.last_air_date // Added
        ? new Date(mediaData.last_air_date)
        : null,
      numberOfSeasons: mediaData.number_of_seasons, // Added
      numberOfEpisodes: mediaData.number_of_episodes, // Added
      status: mediaData.status, // Added
      originalCountry: mediaData.origin_country || [],
    };

    const mediaTypeMetadata =
      finalMediaType === 'MOVIE'
        ? {
            MovieMetadata: {
              create: movieMetadata,
            },
          }
        : {
            TvMetadata: {
              create: tvMetadata,
            },
          };

    // For new records, create media with metadata
    const createData = {
      ...baseMediaData,
      ...mediaTypeMetadata,
    };

    // Find existing media to check its type
    const existingMedia = await db.media.findUnique({
      where: { externalId: tmdbId.toString() },
      include: {
        MovieMetadata: true,
        TvMetadata: true,
      },
    });

    if (existingMedia) {
      return db.$transaction(async tx => {
        // Always delete existing metadata before update
        if (finalMediaType === 'MOVIE') {
          await tx.movieMetadata.deleteMany({
            where: { mediaId: existingMedia.id },
          });
        } else {
          await tx.tvMetadata.deleteMany({
            where: { mediaId: existingMedia.id },
          });
        }

        // Update media with new data
        const updateData = {
          ...baseMediaData,
          updatedAt: new Date(),
          ...(finalMediaType === 'MOVIE'
            ? {
                MovieMetadata: {
                  create: movieMetadata,
                },
              }
            : {
                TvMetadata: {
                  create: tvMetadata,
                },
              }),
        };

        return tx.media.update({
          where: { externalId: tmdbId.toString() },
          data: updateData,
        });
      });
    }

    // For new records, create media with metadata
    return db.media.create({
      data: createData,
    });
  }

  generateSlug(title: string, tmdbId: number, type: MediaType): string {
    return (
      title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-') +
      '-' +
      tmdbId +
      '-' +
      type
    );
  }

  private extractTmdbIdFromSlug(slug: string): number | null {
    // Look for digits between two dashes, where the last part is likely the media type
    const match = slug.match(/-(\d+)-(MOVIE|TV)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  private getMediaTypeFromSlug(slug: string): MediaType {
    const match = slug.match(/-(\d+)-(MOVIE|TV)$/);
    return match ? (match[2] as MediaType) : 'TV'; // Default to TV if not found
  }

  public extractFromSlug(slug: string): {
    tmdbId: number;
    mediaType: MediaType;
    title: string;
  } {
    const match = slug.match(/-(\d+)-(MOVIE|TV)$/);
    if (!match) {
      throw new Error('Invalid slug format');
    }

    const tmdbId = this.extractTmdbIdFromSlug(slug);
    const mediaType = this.getMediaTypeFromSlug(slug);
    const title = slug.split('-').slice(0, -2).join('-');

    return { tmdbId, mediaType, title };
  }

  // ----- New Methods -----
  public async searchMedias(query: string): Promise<Media[]> {
    // if query is empty, return empty array
    if (!query) {
      return [];
    }

    // Search for TMDB media
    const tmdbResults = await this.tmdb.searchMulti({
      query,
      page: 1,
    });
    // Map TMDB results to Media format
    const mappedTMDBResults = mapTMDBResults(tmdbResults.results);

    // Search for Custom Media
    let customResults: CustomMedia[] = [];
    if (context.currentUser) {
      // Only search custom media if user is authenticated
      customResults = await db.customMedia.findMany({
        where: {
          userId: context.currentUser.id,
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 3,
      });
    }

    // Map Custom Media results to Media format
    const mappedCustomResults = customResults.map(media =>
      mapCustomResult(media)
    );

    // Ensure all results conform to Media type with proper date handling
    const results = [...mappedCustomResults, ...mappedTMDBResults].map(
      media => {
        const parsedDate = media.releaseDate
          ? new Date(media.releaseDate)
          : null;
        return {
          ...media,
          id: media.id,
          title: media.title,
          slug: media.slug,
          mediaType: media.mediaType || 'BOOK',
          originalTitle: media.originalTitle || null,
          description: media.description || null,
          posterUrl: media.posterUrl || null,
          backdropUrl: media.backdropUrl || null,
          popularity: media.popularity || null,
          releaseDate: parsedDate,
          createdAt: new Date(media.createdAt),
          updatedAt: new Date(media.updatedAt),
          MovieMetadata: media.MovieMetadata || null,
          TvMetadata: media.TvMetadata || null,
          externalId: media.externalId || null,
        };
      }
    );

    return results;
  }
}
