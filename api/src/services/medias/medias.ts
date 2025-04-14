import type {
  MediaRelationResolvers,
  QueryResolvers,
  MovieMetadata,
  TvMetadata,
} from 'types/graphql';

import { db } from 'src/lib/db';
import { mapTMDBResults } from 'src/services/medias/mediamanager/mapresult';

import MediaManager from './mediamanager';
import TheMovieDb from './themoviedb';
import { TmdbSearchMultiResponse } from './themoviedb/interfaces';

// Convert raw media to resolver-compatible media
type MediaInput = {
  id?: string;
  title?: string;
  slug?: string;
  mediaType?: 'MOVIE' | 'TV' | 'BOOK';
  externalId?: string | null;
  originalTitle?: string | null;
  description?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  popularity?: number | null;
  releaseDate?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  MovieMetadata?: MovieMetadata | null;
  TvMetadata?: TvMetadata | null;
};

const prepareMediaForResolver = (media: MediaInput | null) => {
  if (!media) return null;

  // Ensure all required fields are present with proper types
  return {
    id: media.id!, // Required by schema
    title: media.title!, // Required by schema
    slug: media.slug!, // Required by schema
    mediaType: media.mediaType ?? 'BOOK',
    externalId: media.externalId ?? null,
    originalTitle: media.originalTitle ?? null,
    description: media.description ?? null,
    posterUrl: media.posterUrl ?? null,
    backdropUrl: media.backdropUrl ?? null,
    popularity: media.popularity ?? null,
    releaseDate: media.releaseDate ? new Date(media.releaseDate) : null,
    createdAt: new Date(media.createdAt!), // Required by schema
    updatedAt: new Date(media.updatedAt!), // Required by schema
    MovieMetadata: media.MovieMetadata ?? null,
    TvMetadata: media.TvMetadata ?? null,
  };
};

export const media: QueryResolvers['media'] = async ({ slug }) => {
  const mediaManager = new MediaManager();
  const result = await mediaManager.getMediaBySlug(slug);
  return prepareMediaForResolver(result);
};

export const medias: QueryResolvers['medias'] = async ({ query }) => {
  const tmdb = new TheMovieDb();
  const results: TmdbSearchMultiResponse = await tmdb.searchMulti({
    query,
    page: Number(1),
  });
  const mediaResults = mapTMDBResults(results.results);
  return mediaResults.map(prepareMediaForResolver);
};

export const similarMedias: QueryResolvers['similarMedias'] = async ({
  slug,
}) => {
  const tmdb = new TheMovieDb();
  const mediaManager = new MediaManager();
  const { mediaType, tmdbId } = mediaManager.extractFromSlug(slug);
  const similarMedias = await tmdb.getSimilarMedias({
    mediaId: tmdbId,
    mediaType,
  });
  const mediaResults = mapTMDBResults(similarMedias.results);
  return mediaResults.map(prepareMediaForResolver);
};

export const searchMedias: QueryResolvers['searchMedias'] = async ({
  query,
}) => {
  const mediaManager = new MediaManager();
  const results = await mediaManager.searchMedias(query);
  return results.map(prepareMediaForResolver);
};

export const MediaResolver: MediaRelationResolvers = {
  MovieMetadata: (_obj, { root }) => {
    return db.media.findUnique({ where: { id: root?.id } }).MovieMetadata();
  },
  TvMetadata: (_obj, { root }) => {
    // Added TvMetadata resolver
    return db.media.findUnique({ where: { id: root?.id } }).TvMetadata();
  },
};
