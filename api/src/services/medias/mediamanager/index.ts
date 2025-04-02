import type { Media } from '@prisma/client';
import { subDays } from 'date-fns';

import { db } from 'src/lib/db';

import TheMovieDb from '../themoviedb';

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
      return existingMedia;
    }

    // If no fresh data, fetch from TMDB
    const tmdbId = this.extractTmdbIdFromSlug(slug);
    if (!tmdbId) return null;

    const mediaType = this.determineMediaTypeFromSlug(slug);
    return this.createOrUpdateFromTmdb(tmdbId, mediaType);
  }

  async createOrUpdateFromTmdb(
    tmdbId: number,
    mediaType: 'movie' | 'tv' | 'anime'
  ): Promise<Media> {
    let mediaData;
    if (mediaType === 'movie') {
      mediaData = await this.tmdb.getMovie({ movieId: tmdbId });
    } else if (mediaType === 'tv') {
      mediaData = await this.tmdb.getTv({ tvId: tmdbId });
    } else {
      // Handle anime (may need separate API)
      mediaData = await this.tmdb.getTv({ tvId: tmdbId }); // Using TV as fallback
    }

    const baseMediaData = {
      externalId: tmdbId.toString(),
      title: mediaData.title || mediaData.name,
      slug: this.generateSlug(mediaData.title || mediaData.name, tmdbId),
      mediaType: mediaType.toUpperCase() as 'MOVIE' | 'TV',
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
      originalCountry: mediaData.origin_country || [],
    };

    const mediaTypeMetadata =
      mediaType === 'movie'
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

    // For existing records, delete old metadata and create new
    const updateData = {
      ...baseMediaData,
      updatedAt: new Date(),
      ...(mediaType === 'movie'
        ? {
            MovieMetadata: {
              delete: true,
              create: movieMetadata,
            },
          }
        : {
            TvMetadata: {
              delete: true,
              create: tvMetadata,
            },
          }),
    };

    return db.media.upsert({
      where: { externalId: tmdbId.toString() },
      create: createData,
      update: updateData,
    });
  }

  generateSlug(title: string, tmdbId: number): string {
    return `${title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')}-${tmdbId}`;
  }

  private extractTmdbIdFromSlug(slug: string): number | null {
    const match = slug.match(/-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  private determineMediaTypeFromSlug(slug: string): 'movie' | 'tv' {
    // Check if slug contains common TV indicators
    if (slug.includes('-tv-') || slug.includes('-season-')) {
      return 'tv';
    }
    return 'movie';
  }
}
