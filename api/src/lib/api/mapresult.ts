import { Media, ResolverTypeWrapper } from 'types/graphql';

import MediaManager from 'src/services/medias/mediamanager';
import {
  TmdbMovieResult,
  TmdbTvResult,
} from 'src/services/medias/themoviedb/interfaces';

export type ServiceMedia = ResolverTypeWrapper<
  Omit<Media, 'releaseDate' | 'createdAt' | 'updatedAt'> & {
    releaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
  } & (
      | {
          mediaType: 'MOVIE';
          MovieMetadata: Media['MovieMetadata'];
        }
      | {
          mediaType: 'TV';
          TvMetadata: Omit<Media['TvMetadata'], 'firstAirDate'> & {
            firstAirDate: Date | null;
          };
        }
    )
>;

export const mapMovieResult = (
  movieResult: TmdbMovieResult
  // media?: Media
): ServiceMedia => {
  const mediaManager = new MediaManager();
  return {
    slug: mediaManager.generateSlug(movieResult.title, movieResult.id, 'MOVIE'),
    externalId: movieResult.id.toString(),
    mediaType: 'MOVIE' as const,
    originalTitle: movieResult.original_title,
    description: movieResult.overview,
    popularity: movieResult.popularity,
    releaseDate: movieResult.release_date
      ? new Date(movieResult.release_date)
      : new Date(0), // Fallback to epoch time if missing
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
): ServiceMedia => {
  const mediaManager = new MediaManager();
  return {
    id: tvResult.id.toString(),
    slug: mediaManager.generateSlug(tvResult.name, tvResult.id, 'TV'),
    // Some results from tmdb dont return the mediaType so we force it here!
    mediaType: 'TV' as const,
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
      : new Date(0), // Fallback to epoch time if missing
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

export const mapSearchResults = (
  results: (TmdbMovieResult | TmdbTvResult)[]
  // media?: Media[]
): ServiceMedia[] =>
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
    .filter((result): result is ServiceMedia => result !== null);
