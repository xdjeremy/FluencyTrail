import type { CustomMedia } from '@prisma/client';
import { Media } from 'types/graphql';

import MediaManager from 'src/services/medias/mediamanager';
import {
  TmdbMovieResult,
  TmdbTvResult,
} from 'src/services/medias/themoviedb/interfaces';

export const mapMovieResult = (
  movieResult: TmdbMovieResult
  // media?: Media
): Media => {
  const mediaManager = new MediaManager();
  return {
    slug: mediaManager.generateSlug(movieResult.title, movieResult.id, 'MOVIE'),
    externalId: movieResult.id.toString(),
    mediaType: 'MOVIE',
    originalTitle: movieResult.original_title,
    description: movieResult.overview,
    popularity: movieResult.popularity,
    releaseDate: movieResult.release_date
      ? new Date(movieResult.release_date)
      : null,
    title: movieResult.title,
    backdropUrl: movieResult.backdrop_path,
    posterUrl: movieResult.poster_path,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: movieResult.id.toString(),
    MovieMetadata: {
      adult: movieResult.adult,
      genres: movieResult.genre_ids.map(id => id.toString()),
      originalLanguage: movieResult.original_language,
      media: null,
      mediaId: null,
      rawData: JSON.stringify(movieResult),
      runtime: null,
    },
    // mediaInfo: media,
  };
};

export const mapTvResult = (
  tvResult: TmdbTvResult
  // media?: Media
): Media => {
  const mediaManager = new MediaManager();
  return {
    id: tvResult.id.toString(),
    slug: mediaManager.generateSlug(tvResult.name, tvResult.id, 'TV'),
    // Some results from tmdb dont return the mediaType so we force it here!
    mediaType: 'TV',
    title: tvResult.name,
    originalTitle: tvResult.original_name,
    description: tvResult.overview,
    popularity: tvResult.popularity,
    backdropUrl: tvResult.backdrop_path,
    posterUrl: tvResult.poster_path,
    createdAt: new Date(),
    updatedAt: new Date(),
    externalId: tvResult.id.toString(),
    releaseDate: tvResult.first_air_date
      ? new Date(tvResult.first_air_date)
      : null,
    TvMetadata: {
      genres: tvResult.genre_ids.map(id => id.toString()),
      originalLanguage: tvResult.original_language,
      media: null,
      mediaId: null,
      originalCountry: tvResult.origin_country,
      adult: false,
      firstAirDate: tvResult.first_air_date
        ? new Date(tvResult.first_air_date)
        : null,
    },

    // mediaInfo: media,
  };
};

export const mapTMDBResults = (
  results: (TmdbMovieResult | TmdbTvResult)[]
): Media[] =>
  results
    .map(result => {
      if (!result.media_type) {
        return null;
      }
      switch (result.media_type) {
        case 'movie':
          return mapMovieResult(result);
        case 'tv':
          return mapTvResult(result);
        default:
          return null;
      }
    })
    .filter((media): media is Media => media !== null);

export const mapCustomResult = (result: CustomMedia): Media => {
  return {
    id: result.id,
    title: result.title,
    slug: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    releaseDate: null, // Custom media doesn't have a release date, it should be null
    mediaType: 'BOOK' as const, // Custom media is always a BOOK
    externalId: result.id, // Use the same ID as external ID for custom media
    // Add required Media fields that were missing
    originalTitle: null,
    description: null,
    posterUrl: null,
    backdropUrl: null,
    popularity: null,
    MovieMetadata: null,
    TvMetadata: null,
  };
};
